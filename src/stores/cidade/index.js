import { defineStore, acceptHMRUpdate } from "pinia";
import { api } from "src/boot/axios";

const path = "/cidade";
export const useCidadeStore = defineStore("cidades", {
  state: () => ({
    cidade: {},
    cidades: [],
  }),
  getters: {},
  actions: {
    async getCidadeCodigoIbge(dto) {
      const resposta = await api.get(`${path}/codigo-ibge/${dto.codigoIbge}`);
      return resposta;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCidadeStore, import.meta.hot));
}
