import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {},
    isAuthenticated: false,
  }),
  getters: {},
  actions: {
    async getMe() {
      const response = await api.get("/auth/me");
      this.user = response.data;
      this.isAuthenticated = true;
    },
  },
});
