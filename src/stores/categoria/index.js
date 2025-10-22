import { defineStore } from "pinia";
import { api } from "src/boot/axios";

const path = "/categoria";
export const useCategoriaStore = defineStore("categoria", {
  state: () => ({
    categorias: [],
    categoria: {},
  }),
  getters: {},
  actions: {
    async index() {
      const response = await api.get(path);
      this.categorias = response.data;
    },
  },
});
