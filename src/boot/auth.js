import { boot } from "quasar/wrappers";
import { useAuthStore } from "src/stores/auth";

export default boot(({ router }) => {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore(); // ← coloca aqui dentro do beforeEach

    // Verificar se a rota é pública
    const isPublicRoute = to.meta.publico === true;

    // Pegar token do localStorage
    const token = localStorage.getItem("access_token");

    // Se já está logado e tenta acessar login, redireciona
    if (token && to.name === "login") {
      next({ name: "tarefas" });
      return;
    }

    // Se não é rota pública e não tem token, redireciona pro login
    if (!isPublicRoute && !token) {
      next({ name: "login" });
      return;
    }

    // Se tem token e não é rota pública, valida permissões
    if (token && !isPublicRoute) {
      try {
        // SEMPRE busca do banco (não verifica se já tem)
        await authStore.getMe();

        next();
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        localStorage.removeItem("access_token");
        authStore.user = null;
        next({ name: "login" });
      }
      return;
    }

    // Qualquer outro caso, permite
    next();
  });
});
