import { defineStore, acceptHMRUpdate } from "pinia";
import { api } from "src/boot/axios";

const path = "/estados";
export const useEstadoStore = defineStore("estados", {
  state: () => ({
    estado: {},
    estados: [],
  }),
  getters: {},
  actions: {
    async index() {
      const resposta = await api.get(path);
      this.estados = resposta.data.data;
      return resposta;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEstadoStore, import.meta.hot));
}
