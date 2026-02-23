// src/boot/axios.js
import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";

const api = axios.create({
  baseURL: process.env.API_URL,
});

// Flag para evitar múltiplos refresh simultâneos
let isRefreshing = false;
// Fila de requests que falharam e aguardam o refresh
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export default boot(({ app, router }) => {
  // Interceptor de REQUEST - adiciona o token em todas as requisições
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor de RESPONSE - refresh automático em 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Tratamento de trial expirado (403 com código específico)
      if (error.response?.status === 403 && error.response?.data?.codigo === 'TRIAL_EXPIRADO') {
        Notify.create({
          type: 'warning',
          message: 'Seu período de teste expirou',
          caption: 'Assine um plano para continuar usando o sistema.',
          position: 'top',
          timeout: 0,
          actions: [
            {
              label: 'Ver Planos',
              color: 'white',
              handler: () => {
                router.push('/planos');
              }
            },
            {
              label: 'Fechar',
              color: 'white'
            }
          ]
        });
        return Promise.reject(error);
      }

      // Tratamento de email não verificado (403)
      if (error.response?.status === 403 && error.response?.data?.codigo === 'EMAIL_NAO_VERIFICADO') {
        Notify.create({
          type: 'warning',
          message: 'Verifique seu e-mail',
          caption: error.response.data.mensagem,
          position: 'top',
          timeout: 5000
        });
        return Promise.reject(error);
      }

      // Se 401 e não é request de refresh/login e não é retry
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/refresh") &&
        !originalRequest.url.includes("/auth/login")
      ) {
        // Se já está fazendo refresh, enfileira este request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await api.post("/refresh");
          const newToken =
            response.data.data?.access_token || response.data.access_token;

          if (newToken) {
            localStorage.setItem("access_token", newToken);
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);

            // Reenviar o request original com novo token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Refresh falhou - limpa auth e redireciona
          localStorage.removeItem("access_token");

          Notify.create({
            type: "negative",
            message: "Sua sessao expirou. Faca login novamente.",
            position: "top",
            timeout: 3000,
          });

          if (router.currentRoute.value.path !== "/auth/login") {
            router.push({ name: "login" });
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  // Disponibiliza o axios globalmente
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
