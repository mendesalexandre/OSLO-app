import { defineStore } from "pinia";
import { api } from "src/boot/axios";

const path = "/configuracao";
export const useConfiguracaoStore = defineStore("configuracao", {
  state: () => ({
    configuracoes: [],
    configuracao: {},
  }),
  getters: {},
  actions: {
    async index() {
      const response = await api.get(path);
      this.configuracoes = response.data;
    },
  },
});
