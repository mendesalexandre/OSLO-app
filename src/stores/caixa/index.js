import { defineStore } from "pinia";
import { api } from "src/boot/axios";

const path = "/caixa";
export const useCaixaStore = defineStore("caixa", {
  state: () => ({
    caixas: [],
    caixa: {},
  }),
  getters: {},
  actions: {
    async index() {
      const response = await api.get(path);
      this.caixas = response.data;
    },
  },
});
