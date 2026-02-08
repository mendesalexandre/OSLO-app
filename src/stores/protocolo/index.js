import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useProtocoloStore = defineStore('protocolo', {
  state: () => ({
    protocolos: [],
    protocolo: null,
    carregando: false,
    paginacao: {
      pagina_atual: 1,
      por_pagina: 15,
      total: 0,
      ultima_pagina: 1,
    },
    filtros: {
      status: null,
      busca: '',
      data_inicio: null,
      data_fim: null,
    },
  }),

  getters: {
    // Valores financeiros
    valorTotal: (state) => state.protocolo?.valor_total || 0,
    valorDesconto: (state) => state.protocolo?.valor_desconto || 0,
    valorIsento: (state) => state.protocolo?.valor_isento || 0,
    valorFinal: (state) => state.protocolo?.valor_final || 0,
    valorPago: (state) => state.protocolo?.valor_pago || 0,
    valorRestante: (state) => {
      const protocolo = state.protocolo
      if (!protocolo) return 0
      return (protocolo.valor_final || 0) - (protocolo.valor_pago || 0)
    },

    // Itens e pagamentos
    itens: (state) => state.protocolo?.itens || [],
    pagamentos: (state) => state.protocolo?.pagamentos || [],
    andamentos: (state) => state.protocolo?.andamentos || [],

    // Status helpers
    estaPago: (state) => state.protocolo?.status === 'pago',
    estaPagoParcial: (state) => state.protocolo?.status === 'pago_parcial',
    estaCancelado: (state) => state.protocolo?.status === 'cancelado',
  },

  actions: {
    // ===== LISTAGEM =====
    async listar(pagina = 1) {
      this.carregando = true
      try {
        const params = {
          pagina,
          por_pagina: this.paginacao.por_pagina,
          ...this.filtros,
        }
        const { data } = await api.get('/protocolo', { params })

        if (data.sucesso) {
          this.protocolos = data.dados
          this.paginacao = data.paginacao || this.paginacao
        }
        return data
      } finally {
        this.carregando = false
      }
    },

    // ===== CARREGAR DETALHES =====
    async carregar(id) {
      this.carregando = true
      try {
        const { data } = await api.get(`/protocolo/${id}`)
        if (data.sucesso) {
          this.protocolo = data.dados
        }
        return data
      } finally {
        this.carregando = false
      }
    },

    // ===== CRIAR =====
    async criar(form) {
      this.carregando = true
      try {
        const { data } = await api.post('/protocolo', form)
        if (data.sucesso) {
          this.protocolo = data.dados
        }
        return data
      } finally {
        this.carregando = false
      }
    },

    // ===== ATUALIZAR =====
    async atualizar(id, form) {
      this.carregando = true
      try {
        const { data } = await api.put(`/protocolo/${id}`, form)
        if (data.sucesso) {
          this.protocolo = data.dados
        }
        return data
      } finally {
        this.carregando = false
      }
    },

    // ===== CANCELAR =====
    async cancelar(id, motivo) {
      this.carregando = true
      try {
        const { data } = await api.post(`/protocolo/${id}/cancelar`, { motivo })
        if (data.sucesso) {
          await this.carregar(id) // Recarrega para pegar status atualizado
        }
        return data
      } finally {
        this.carregando = false
      }
    },

    // ===== ITENS =====
    async adicionarItem(id, form) {
      this.carregando = true
      try {
        const { data } = await api.post(`/protocolo/${id}/item`, form)
        if (data.sucesso) {
          await this.carregar(id) // Recarrega tudo
        }
        return data
      } finally {
        this.carregando = false
      }
    },

    async removerItem(id, itemId) {
      this.carregando = true
      try {
        const { data } = await api.delete(`/protocolo/${id}/item/${itemId}`)
        if (data.sucesso) {
          await this.carregar(id)
        }
        return data
      } finally {
        this.carregando = false
      }
    },

    // ===== PAGAMENTO =====
    async registrarPagamento(id, form) {
      this.carregando = true
      try {
        const { data } = await api.post(`/protocolo/${id}/pagamento`, form)
        if (data.sucesso) {
          await this.carregar(id)
        }
        return data
      } finally {
        this.carregando = false
      }
    },

    async estornarPagamento(id, pagamentoId, motivo) {
      this.carregando = true
      try {
        const { data } = await api.post(
          `/protocolo/${id}/pagamento/${pagamentoId}/estornar`,
          { motivo }
        )
        if (data.sucesso) {
          await this.carregar(id)
        }
        return data
      } finally {
        this.carregando = false
      }
    },

    // ===== RECALCULAR =====
    async recalcular(id) {
      const { data } = await api.post(`/protocolo/${id}/recalcular`)
      if (data.sucesso) {
        await this.carregar(id)
      }
      return data
    },

    // ===== FILTROS =====
    setFiltro(campo, valor) {
      this.filtros[campo] = valor
    },

    limparFiltros() {
      this.filtros = {
        status: null,
        busca: '',
        data_inicio: null,
        data_fim: null,
      }
    },
  },
})
