// src/boot/auth.js - Versão 2 com verificação automática do usuário
import { boot } from "quasar/wrappers";
import { Notify, Loading } from "quasar";
import { api } from "src/boot/axios"; // Importar instância do axios

export default boot(async ({ app, router }) => {
  // Configurações
  const AUTH_CONFIG = {
    tokenKey: "access_token",
    userKey: "doi_user",
    permissionsKey: "doi_permissions",
    rememberKey: "doi_remember_user",
    sessionConfigKey: "doi_session_config",
    expiresAtKey: "doi_token_expires_at",
  };

  // Função para verificar se token existe
  const hasToken = () => {
    return !!localStorage.getItem(AUTH_CONFIG.tokenKey);
  };

  // Função para verificar se token está válido (não expirado)
  const isTokenValid = () => {
    const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
    const expiresAt = localStorage.getItem(AUTH_CONFIG.expiresAtKey);

    if (!token) return false;

    if (expiresAt) {
      const now = new Date().getTime();
      const expires = new Date(expiresAt).getTime();
      return now < expires;
    }

    return true; // Se não tem expiração, assumir que é válido
  };

  // Função para verificar autenticação completa
  const checkAuthentication = () => {
    return hasToken() && isTokenValid();
  };

  // Função para limpar dados de autenticação
  const clearAuthData = () => {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
    localStorage.removeItem(AUTH_CONFIG.userKey);
    localStorage.removeItem(AUTH_CONFIG.permissionsKey);
    localStorage.removeItem(AUTH_CONFIG.sessionConfigKey);
    localStorage.removeItem(AUTH_CONFIG.expiresAtKey);
    // Manter remember_user para facilitar próximo login
  };

  // Função para salvar dados do usuário
  const saveUserData = (userData, permissions = []) => {
    localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(userData));
    localStorage.setItem(
      AUTH_CONFIG.permissionsKey,
      JSON.stringify(permissions)
    );
  };

  // Função para fazer logout automático
  const performAutoLogout = (reason = "token_expired") => {
    clearAuthData();

    // Mostrar notificação
    const messages = {
      token_expired: "Sua sessão expirou. Faça login novamente.",
      unauthorized: "Acesso não autorizado. Faça login novamente.",
      server_error: "Erro de servidor. Faça login novamente.",
      invalid_token: "Token inválido. Faça login novamente.",
      manual: "Logout realizado com sucesso.",
    };

    if (reason !== "manual") {
      Notify.create({
        color: "negative",
        message: messages[reason] || "Sessão encerrada.",
        icon: "logout",
        position: "top",
        timeout: 5000,
      });
    }

    // Redirecionar para login se não estiver já lá
    const currentRoute = router.currentRoute.value;
    if (currentRoute.name !== "login" && !currentRoute.meta.requiresGuest) {
      router.push({
        name: "login",
        query: { redirect: currentRoute.fullPath },
      });
    }
  };

  // Função para verificar usuário no servidor
  const verifyUserWithServer = async () => {
    const token = localStorage.getItem(AUTH_CONFIG.tokenKey);

    if (!token) {
      console.log("Auth Boot: Nenhum token encontrado");
      return false;
    }

    try {
      console.log("Auth Boot: Verificando usuário no servidor...");

      // Fazer requisição para obter dados do usuário
      const response = await api.get("/auth/me");

      if (response.data && response.data.user) {
        console.log(
          "Auth Boot: Usuário verificado com sucesso",
          response.data.user
        );

        // Salvar dados atualizados do usuário
        saveUserData(response.data.user, response.data.permissions || []);

        return true;
      } else {
        console.warn("Auth Boot: Resposta inválida do servidor");
        performAutoLogout("invalid_token");
        return false;
      }
    } catch (error) {
      console.error("Auth Boot: Erro ao verificar usuário", error);

      if (error.response?.status === 401) {
        // Token inválido ou expirado
        performAutoLogout("unauthorized");
      } else if (error.response?.status >= 500) {
        // Erro de servidor - manter dados locais
        console.warn(
          "Auth Boot: Erro de servidor, mantendo autenticação local"
        );
        return true;
      } else {
        // Outros erros - fazer logout
        performAutoLogout("server_error");
      }

      return false;
    }
  };

  // Função para obter dados do usuário
  const getUser = () => {
    try {
      const userData = localStorage.getItem(AUTH_CONFIG.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  // Função para obter permissões
  const getPermissions = () => {
    try {
      const permissions = localStorage.getItem(AUTH_CONFIG.permissionsKey);
      return permissions ? JSON.parse(permissions) : [];
    } catch {
      return [];
    }
  };

  // Função para verificar permissão específica
  const hasPermission = (permission) => {
    const permissions = getPermissions();
    return permissions.includes(permission);
  };

  // Função para configurar interceptors (reutilizável)
  function setupAxiosInterceptors(axiosInstance) {
    // Request interceptor - adicionar token e headers
    axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_CONFIG.tokenKey);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Adicionar headers padrão
        config.headers["Accept"] = "application/json";
        config.headers["Content-Type"] = "application/json";
        config.headers["X-Requested-With"] = "XMLHttpRequest";

        return config;
      },
      (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - lidar com respostas e erros
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Response Error:", error);

        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;

          switch (status) {
            case 401:
              // Token expirado ou inválido
              performAutoLogout("unauthorized");
              break;

            case 403:
              // Sem permissão
              Notify.create({
                color: "negative",
                message: data.error || "Acesso negado.",
                icon: "block",
                position: "top",
              });
              break;

            case 422:
              // Erro de validação - não mostrar notificação global
              break;

            case 429:
              // Rate limit
              Notify.create({
                color: "warning",
                message: "Muitas tentativas. Aguarde um momento.",
                icon: "warning",
                position: "top",
              });
              break;

            case 500:
            case 502:
            case 503:
            case 504:
              // Erro de servidor
              Notify.create({
                color: "negative",
                message:
                  "Erro interno do servidor. Tente novamente mais tarde.",
                icon: "error",
                position: "top",
              });
              break;
          }
        } else if (error.request) {
          // Erro de rede
          Notify.create({
            color: "negative",
            message: "Erro de conexão. Verifique sua internet.",
            icon: "wifi_off",
            position: "top",
          });
        }

        return Promise.reject(error);
      }
    );
  }

  // Configurar interceptors para instância global do Axios
  if (app.config.globalProperties.$axios) {
    setupAxiosInterceptors(app.config.globalProperties.$axios);
  }

  // Configurar interceptors para instância customizada da API
  if (app.config.globalProperties.$api) {
    setupAxiosInterceptors(app.config.globalProperties.$api);
  }

  // Configurar interceptors para a instância importada
  setupAxiosInterceptors(api);

  // Verificação inicial da autenticação
  let initialAuthCheck = false;

  if (hasToken()) {
    if (isTokenValid()) {
      console.log("Auth Boot: Token encontrado, verificando no servidor...");

      // Mostrar loading durante verificação
      Loading.show({
        message: "Verificando autenticação...",
        spinnerColor: "primary",
      });

      try {
        initialAuthCheck = await verifyUserWithServer();
      } catch (error) {
        console.error("Auth Boot: Erro na verificação inicial", error);
        initialAuthCheck = false;
      } finally {
        Loading.hide();
      }
    } else {
      console.log("Auth Boot: Token expirado, limpando dados");
      performAutoLogout("token_expired");
    }
  } else {
    console.log("Auth Boot: Nenhum token encontrado");
  }

  // Guards de navegação
  router.beforeEach((to, from, next) => {
    const isAuthenticated = checkAuthentication();
    const requiresAuth = to.meta.requiresAuth;
    const requiresGuest = to.meta.requiresGuest;
    const requiredPermission = to.meta.permission;

    // Verificar se a rota requer autenticação
    if (requiresAuth && !isAuthenticated) {
      return next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    }

    // Verificar se a rota é apenas para convidados (não logados)
    if (requiresGuest && isAuthenticated) {
      const redirectTo = to.query.redirect || "/";
      return next(redirectTo);
    }

    // Verificar permissão específica da rota
    if (
      isAuthenticated &&
      requiredPermission &&
      !hasPermission(requiredPermission)
    ) {
      Notify.create({
        color: "negative",
        message: "Você não tem permissão para acessar esta página.",
        icon: "block",
        position: "top",
      });
      return next({ name: "dashboard" });
    }

    // Definir título da página
    if (to.meta.title) {
      document.title = to.meta.title;
    }

    next();
  });

  // Disponibilizar funções globalmente
  app.config.globalProperties.$auth = {
    // Estado
    isAuthenticated: checkAuthentication,
    hasToken,
    isTokenValid,
    getUser,
    getPermissions,
    hasPermission,

    // Ações
    logout: () => performAutoLogout("manual"),
    clearData: clearAuthData,
    verifyUser: verifyUserWithServer,
    saveUserData,

    // Configuração
    config: AUTH_CONFIG,
  };

  // Log inicial
  console.log("Auth Boot: Inicialização completa", {
    hasToken: hasToken(),
    isValid: isTokenValid(),
    verified: initialAuthCheck,
    user: getUser()?.name || "Guest",
    permissions: getPermissions(),
  });
});
