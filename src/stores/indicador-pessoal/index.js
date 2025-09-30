import { defineStore, acceptHMRUpdate } from "pinia";

export const useIndicadorPessoal = defineStore("indicador-pessoal", {
  state: () => ({
    indicadorPessoal: {},
  }),
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIndicadorPessoal, import.meta.hot));
}
