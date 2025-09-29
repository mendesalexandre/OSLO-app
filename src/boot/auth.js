import { defineBoot } from "#q-app/wrappers";
import { useAuthStore } from "src/stores/auth";

let lastValidation = null;
const VALIDATION_INTERVAL = 5 * 60 * 1000; // 5 minutos

export default defineBoot(({ router }) => {
  const authStore = useAuthStore();

  router.beforeEach(async (to, from, next) => {
    const isPublicRoute = to.meta.publico === true;
    const token = localStorage.getItem("access_token");

    if (!isPublicRoute && !token) {
      next("/login");
      return;
    }

    if (token && !isPublicRoute) {
      const now = Date.now();
      const shouldValidate =
        !lastValidation || now - lastValidation > VALIDATION_INTERVAL;

      if (shouldValidate) {
        try {
          await authStore.getMe();
          lastValidation = now;
        } catch (error) {
          localStorage.removeItem("access_token");
          next("/login");
          return;
        }
      }
    }

    // Evita ir para login se já estiver autenticado
    if (token && to.path === "/login") {
      next("/");
      return;
    }

    next();
  });
});
