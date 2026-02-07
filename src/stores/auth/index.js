import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    userName: (state) =>
      state.user?.user?.nome || state.user?.nome || "Usuario",
    userEmail: (state) =>
      state.user?.user?.email || state.user?.email || "",
  },

  actions: {
    async getMe() {
      const response = await api.get("/auth/me");
      // API retorna { success: true, data: { user: {...}, permissions: [...], roles: [...] } }
      this.user = response.data.data || response.data;
      this.isAuthenticated = true;
    },

    async logout() {
      try {
        await api.post("/logout");
      } catch (error) {
        console.error("Erro ao fazer logout no servidor:", error);
      } finally {
        this.clearAuth();
      }
    },

    setToken(token) {
      localStorage.setItem("access_token", token);
      this.isAuthenticated = true;
    },

    clearAuth() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem("access_token");
    },
  },
});
