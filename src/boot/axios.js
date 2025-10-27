// src/boot/axios.js
import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";

// Cria a instância do axios com baseURL dinâmica
const api = axios.create({
  baseURL: process.env.API_URL,
});

export default boot(({ app, router, store }) => {
  // Interceptor de REQUEST - adiciona o token em todas as requisições
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de RESPONSE - verifica se o token expirou
  api.interceptors.response.use(
    (response) => {
      // Se a resposta for bem-sucedida, apenas retorna
      return response;
    },
    (error) => {
      // Verifica se o erro é 401 (Unauthorized - token expirado ou inválido)
      if (error.response && error.response.status === 401) {
        // Limpa os dados de autenticação do localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        // Adicione aqui outros itens que você armazena

        // Se você usa Vuex, limpe o state também
        // store.dispatch('auth/logout')

        // Se você usa Pinia, limpe o store
        // const authStore = useAuthStore()
        // authStore.logout()

        // Notifica o usuário
        Notify.create({
          type: "negative",
          message: "Sua sessão expirou. Faça login novamente.",
          position: "top",
          timeout: 3000,
        });

        // Redireciona para a página de login
        // Verifica se já não está na página de login para evitar loop
        if (router.currentRoute.value.path !== "/login") {
          router.push("/login");
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
