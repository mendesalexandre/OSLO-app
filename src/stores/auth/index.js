import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {},
    isAuthenticated: false,
  }),
  getters: {},
  actions: {},
});
