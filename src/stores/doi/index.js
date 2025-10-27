// stores/doi.js
import { defineStore } from "pinia";
import { api } from "src/boot/axios"; // ou sua instância do axios
const path = "/declaracao-imobiliaria"; // Defina o caminho base para as DOIs
export const useDoiStore = defineStore("doi", {
  state: () => ({
    declaracoes: [],
    declaracao: null,
    lotes: [],
    loading: false,
  }),

  actions: {
    // Listar todas as DOIs
    async index() {
      try {
        this.loading = true;
        const response = await api.get(`${path}`);
        this.declaracoes = response.data.data || response.data;
        return response.data;
      } catch (error) {
        console.error("Erro ao carregar Declarações:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar DOI específica
    async show(id) {
      try {
        const response = await api.get(`${path}/${id}`);
        this.declaracao = response.data.data || response.data;
        return response.data;
      } catch (error) {
        console.error("Erro ao carregar DOI:", error);
        throw error;
      }
    },

    // Criar nova DOI
    async store(data) {
      try {
        const response = await api.post(`${path}`, data);
        await this.index(); // Recarregar lista
        return response.data;
      } catch (error) {
        console.error("Erro ao criar DOI:", error);
        throw error;
      }
    },

    // Atualizar DOI
    async update(id, data) {
      try {
        const response = await api.put(`${path}/${id}`, data);
        await this.index(); // Recarregar lista
        return response.data;
      } catch (error) {
        console.error("Erro ao atualizar DOI:", error);
        throw error;
      }
    },

    // Excluir DOI
    async delete(id) {
      try {
        const response = await api.delete(`${path}/${id}`);
        await this.index(); // Recarregar lista
        return response.data;
      } catch (error) {
        console.error("Erro ao excluir DOI:", error);
        throw error;
      }
    },

    // Preview do lote (baseado no controller)
    async previewLote(dataInicio, dataFim) {
      try {
        const response = await api.post("/lote-doi/preview", {
          data_inicio: dataInicio,
          data_fim: dataFim,
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao fazer preview do lote:", error);
        throw error;
      }
    },

    // Criar lote (baseado no controller)
    async criarLote(dataInicio, dataFim) {
      try {
        const response = await api.post("/lote-doi/criar", {
          data_inicio: dataInicio,
          data_fim: dataFim,
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao criar lote:", error);
        throw error;
      }
    },

    // Download do lote (baseado no controller)
    async downloadLote(loteId) {
      try {
        const response = await api.get(`/api/lote-doi/${loteId}/download`, {
          responseType: "blob",
        });

        // Criar link para download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Extrair nome do arquivo do header Content-Disposition
        const contentDisposition = response.headers["content-disposition"];
        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : `dois_lote_${loteId}.json`;

        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return response.data;
      } catch (error) {
        console.error("Erro ao baixar lote:", error);
        throw error;
      }
    },

    // Marcar lote como enviado (baseado no controller)
    async marcarLoteEnviado(loteId) {
      try {
        const response = await api.patch(`/lote-doi/${loteId}/marcar-enviado`);
        return response.data;
      } catch (error) {
        console.error("Erro ao marcar lote como enviado:", error);
        throw error;
      }
    },

    // Listar lotes do usuário (baseado no controller)
    async listarLotes() {
      try {
        const response = await api.get("/lote-doi/listar");
        this.lotes = response.data.data || response.data;
        return response.data;
      } catch (error) {
        console.error("Erro ao listar lotes:", error);
        throw error;
      }
    },

    // Imprimir DOI individual
    async imprimirDoi(id) {
      try {
        const response = await api.get(`/dois/${id}/imprimir`, {
          responseType: "blob",
        });

        // Criar link para download/impressão
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        const filename = `doi_${id}.pdf`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return response.data;
      } catch (error) {
        console.error("Erro ao imprimir DOI:", error);
        throw error;
      }
    },

    // Filtrar DOIs por status
    async filtrarPorStatus(status) {
      try {
        const response = await api.get(`${path}`, {
          params: { status_processamento: status },
        });
        this.declaracoes = response.data.data || response.data;
        return response.data;
      } catch (error) {
        console.error("Erro ao filtrar DOIs:", error);
        throw error;
      }
    },

    // Filtrar DOIs por período
    async filtrarPorPeriodo(dataInicio, dataFim) {
      try {
        const response = await api.get(`${path}`, {
          params: {
            data_inicio: dataInicio,
            data_fim: dataFim,
          },
        });
        this.declaracoes = response.data.data || response.data;
        return response.data;
      } catch (error) {
        console.error("Erro ao filtrar DOIs por período:", error);
        throw error;
      }
    },

    // Buscar DOIs disponíveis para lote (não enviadas e concluídas)
    async buscarDisponiveis() {
      try {
        const response = await api.get(`${path}/disponiveis`);
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar DOIs disponíveis:", error);
        throw error;
      }
    },

    // Validar DOI antes de salvar
    async validarDoi(data) {
      try {
        const response = await api.post(`${path}/validar`, data);
        return response.data;
      } catch (error) {
        console.error("Erro ao validar DOI:", error);
        throw error;
      }
    },

    // Reprocessar DOI com erro
    async reprocessarDoi(id) {
      try {
        const response = await api.post(`/${path}/${id}/reprocessar`);
        await this.index(); // Recarregar lista
        return response.data;
      } catch (error) {
        console.error("Erro ao reprocessar DOI:", error);
        throw error;
      }
    },

    // Exportar DOIs para Excel
    async exportarExcel(filtros = {}) {
      try {
        const response = await api.get("/api/dois/exportar-excel", {
          params: filtros,
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        const filename = `dois_${new Date().toISOString().split("T")[0]}.xlsx`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return response.data;
      } catch (error) {
        console.error("Erro ao exportar Excel:", error);
        throw error;
      }
    },

    async sincronizarDeclaracaoReceita(dataInicio, dataFim) {},

    // Limpar estado
    resetDeclaracao() {
      this.declaracao = null;
    },

    // Definir declaração atual
    setDeclaracao(declaracao) {
      this.declaracao = declaracao;
    },
    // Pesquisar lotes com filtros
    async pesquisarLotes(filtros = {}) {
      try {
        this.loading = true;
        const params = {};

        if (filtros.dataInicio) params.data_inicio = filtros.dataInicio;
        if (filtros.dataFim) params.data_fim = filtros.dataFim;
        if (filtros.numeroLote) params.numero = filtros.numeroLote;
        if (filtros.status) params.status = filtros.status;

        const response = await api.get("/lote-doi/pesquisar", { params });
        this.lotes = response.data.data || response.data;
        return response.data;
      } catch (error) {
        console.error("Erro ao pesquisar lotes:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Obter detalhes completos do lote
    async obterDetalhesLote(loteId) {
      try {
        const response = await api.get(`/lote-doi/${loteId}/detalhes`);
        return response.data;
      } catch (error) {
        console.error("Erro ao obter detalhes do lote:", error);
        throw error;
      }
    },

    // Gerar relatório PDF de um lote específico
    async gerarRelatorioPDF(loteId) {
      try {
        const response = await api.get(`/lote-doi/${loteId}/relatorio-pdf`, {
          responseType: "blob",
        });

        // Criar link para download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Extrair nome do arquivo do header ou usar padrão
        const contentDisposition = response.headers["content-disposition"];
        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : `relatorio_lote_${loteId}.pdf`;

        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return {
          success: true,
          download_url: url,
          filename: filename,
        };
      } catch (error) {
        console.error("Erro ao gerar relatório PDF:", error);
        throw error;
      }
    },

    // Gerar relatório PDF geral (múltiplos lotes)
    async gerarRelatorioGeralPDF(lotesIds) {
      try {
        const response = await api.post(
          "/lote-doi/relatorio-geral-pdf",
          {
            lotes_ids: lotesIds,
          },
          {
            responseType: "blob",
          }
        );

        // Criar link para download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Nome do arquivo
        const dataAtual = new Date().toISOString().split("T")[0];
        const filename = `relatorio_geral_lotes_${dataAtual}.pdf`;

        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return {
          success: true,
          download_url: url,
          filename: filename,
        };
      } catch (error) {
        console.error("Erro ao gerar relatório geral PDF:", error);
        throw error;
      }
    },

    // Obter estatísticas dos lotes
    async obterEstatisticasLotes() {
      try {
        const response = await api.get("/lote-doi/estatisticas");
        return response.data;
      } catch (error) {
        console.error("Erro ao obter estatísticas dos lotes:", error);
        throw error;
      }
    },

    // Excluir lote e liberar declarações
    async excluirLote(loteId) {
      try {
        const response = await api.delete(`/lote-doi/${loteId}/excluir`);
        return response.data;
      } catch (error) {
        console.error("Erro ao excluir lote:", error);
        throw error;
      }
    },

    // Verificar se lote pode ser excluído
    async verificarExclusaoLote(loteId) {
      try {
        const response = await api.get(
          `/lote-doi/${loteId}/verificar-exclusao`
        );
        return response.data;
      } catch (error) {
        console.error("Erro ao verificar exclusão do lote:", error);
        throw error;
      }
    },
  },

  getters: {
    // DOIs por status
    declaracoesPorStatus: (state) => (status) => {
      return state.declaracoes.filter(
        (doi) => doi.status_processamento === status
      );
    },

    // DOIs pendentes
    declaracoesPendentes: (state) => {
      return state.declaracoes.filter(
        (doi) => doi.status_processamento === "pendente"
      );
    },

    // DOIs concluídas
    declaracoesConcluidas: (state) => {
      return state.declaracoes.filter(
        (doi) => doi.status_processamento === "concluido"
      );
    },

    // DOIs com erro
    declaracoesComErro: (state) => {
      return state.declaracoes.filter(
        (doi) => doi.status_processamento === "erro"
      );
    },

    // DOIs disponíveis para lote (concluídas e sem lote)
    declaracoesDisponiveis: (state) => {
      return state.declaracoes.filter(
        (doi) => doi.status_processamento === "concluido" && !doi.lote_doi_id
      );
    },

    // DOIs já enviadas em lotes
    declaracoesEnviadas: (state) => {
      return state.declaracoes.filter((doi) => doi.lote_doi_id);
    },

    // Estatísticas
    estatisticas: (state) => {
      const total = state.declaracoes.length;
      const pendentes = state.declaracoes.filter(
        (d) => d.status_processamento === "pendente"
      ).length;
      const concluidas = state.declaracoes.filter(
        (d) => d.status_processamento === "concluido"
      ).length;
      const comErro = state.declaracoes.filter(
        (d) => d.status_processamento === "erro"
      ).length;
      const enviadas = state.declaracoes.filter((d) => d.lote_doi_id).length;

      return {
        total,
        pendentes,
        concluidas,
        comErro,
        enviadas,
        disponiveis: concluidas - enviadas,
      };
    },
  },
});
