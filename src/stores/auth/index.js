import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    permissoes: [],
    modulos: {},
    grupos: [],
  }),

  getters: {
    userName: (state) =>
      state.user?.user?.nome || state.user?.nome || "Usuario",
    userEmail: (state) =>
      state.user?.user?.email || state.user?.email || "",
    isAdmin: (state) => state.grupos.includes("Administrador"),
  },

  actions: {
    async getMe() {
      const response = await api.get("/auth/me");
      const data = response.data.data || response.data;
      this.user = data;
      this.isAuthenticated = true;
      this.permissoes = data.permissoes || [];
      this.modulos = data.modulos || {};
      this.grupos = data.user?.grupos || data.grupos || [];

      // Persistir permissões no localStorage
      localStorage.setItem("permissoes", JSON.stringify(this.permissoes));
      localStorage.setItem("modulos", JSON.stringify(this.modulos));
      localStorage.setItem("grupos", JSON.stringify(this.grupos));
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

    setPermissoes(data) {
      this.permissoes = data.permissoes || [];
      this.modulos = data.modulos || {};
      this.grupos = data.user?.grupos || data.grupos || [];

      localStorage.setItem("permissoes", JSON.stringify(this.permissoes));
      localStorage.setItem("modulos", JSON.stringify(this.modulos));
      localStorage.setItem("grupos", JSON.stringify(this.grupos));
    },

    loadFromStorage() {
      try {
        const permissoes = localStorage.getItem("permissoes");
        const modulos = localStorage.getItem("modulos");
        const grupos = localStorage.getItem("grupos");

        if (permissoes) this.permissoes = JSON.parse(permissoes);
        if (modulos) this.modulos = JSON.parse(modulos);
        if (grupos) this.grupos = JSON.parse(grupos);
      } catch {
        // localStorage parse error, ignore
      }
    },

    clearAuth() {
      this.user = null;
      this.isAuthenticated = false;
      this.permissoes = [];
      this.modulos = {};
      this.grupos = [];
      localStorage.removeItem("access_token");
      localStorage.removeItem("permissoes");
      localStorage.removeItem("modulos");
      localStorage.removeItem("grupos");
    },
  },
});
