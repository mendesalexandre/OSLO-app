import { defineStore, acceptHMRUpdate } from "pinia";
import { api } from "src/boot/axios";

export const useNaturezaStore = defineStore("naturezas", {
  state: () => ({
    natureza: {},
    naturezas: [],
    loading: false,
  }),
  getters: {},
  actions: {
    // Busca naturezas com filtro dinâmico
    async fetchNaturezas(filtro = "") {
      this.loading = true;

      const response = await api.get("/natureza", {
        params: {
          filtro: {
            nome: filtro, // Envia como ?filtro[nome]=valor
          },
        },
      });

      this.naturezas = response.data;
      this.loading = false;

      return response.data;
    },

    // Busca uma natureza específica por ID
    async fetchNatureza(id) {
      this.loading = true;

      const response = await api.get(`/natureza/${id}`);

      this.natureza = response.data;
      this.loading = false;

      return response.data;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMyStore, import.meta.hot));
}
