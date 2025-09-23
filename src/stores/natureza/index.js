import { defineStore } from "pinia";
import { api } from "src/boot/axios";

const path = "/api/v1/natureza";
export const useNaturezaStore = defineStore("natureza", {
  state: () => ({
    naturezas: [],
    natureza: {},
  }),
  getters: {},
  actions: {
    async index() {
      const response = await api.get(`${path}`);
      this.naturezas = response.data;
      return response;
    },

    async show(dto) {
      const response = await api.get(`${path}/${dto}`);
      this.natureza = response.data;
      return response;
    },
  },
});
