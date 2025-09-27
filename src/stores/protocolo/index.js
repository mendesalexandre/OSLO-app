import { defineStore } from "pinia";
import { api } from "src/boot/axios";

const path = "/api/v1/protocolo";
export const useProtocoloStore = defineStore("protocolo", {
  state: () => ({
    protocolos: [],
    protocolo: {
      anotacao: "",
      anotacoes: [], // Adicionado para evitar erro de undefined,
      atos: [], // Adicionado para evitar erro de undefined,
    },

    protocoloSelecionado: null,
  }),
  getters: {
    atos: (state) => state.protocolo.atos,
    anotacoes: (state) => state.protocolo.anotacoes,

    totalEmolumentos: (state) => {
      return state.protocolo.atos.reduce((total, ato) => {
        return total + ato.emolumento;
      }, 0);
    },

    totalEmolumentoGeral: (state) => {
      return state.protocolo.atos.reduce((total, ato) => {
        return (total += ato.valor_total);
      }, 0);
    },
  },
  actions: {
    async index() {
      const response = await api.get(`${path}`);
      this.protocolos = response.data;
      return response;
    },

    async protocoloAgrupadoPorDominio() {
      const response = await api.get(`${path}/agrupado-por-dominio`);
      this.protocolos = response.data;
      return response;
    },

    async show(id) {
      const response = await api.get(`${path}/${id}`);
      this.protocolo = {
        ...response.data,
        anotacao: "",
      };
      this.protocoloSelecionado = this.protocolo;
      return response;
    },

    async create(payload) {
      const response = await api.post(`${path}/create`, payload);
      this.protocolo = response.data;
      return response;
    },

    async update(id, payload) {
      const response = await api.put(`${path}/${id}`, payload);
      this.protocolo = response.data;
      return response;
    },

    async delete(id) {
      const response = await api.delete(`${path}/${id}`);
      this.protocolos = this.protocolos.filter(
        (protocolo) => protocolo.id !== id
      );
      return response;
    },

    async criarLoteArquivo(file) {
      const formData = new FormData();
      formData.append("file", file);

      let config = {
        timeout: 0,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      return Http.post(`${path}/lote-arquivo`, formData, config);
    },

    async avancarEtapa(protocolo, dto) {
      const response = await api.put(`${path}/${protocolo}/avancar-etapa`, dto);
      this.protocolo = response.data;
      return response;
    },
  },
});
