import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useMeioPagamentoStore = defineStore('meioPagamento', {
  state: () => ({
    meios: [],
    carregando: false,
  }),

  getters: {
    meiosAtivos: (state) => state.meios.filter((m) => m.ativo),

    porId: (state) => (id) => state.meios.find((m) => m.id === id),

    porFormaPagamento: (state) => (formaPagamentoId) => {
      return state.meios.filter((m) => m.forma_pagamento_id === formaPagamentoId && m.ativo)
    },
  },

  actions: {
    async listar(formaPagamentoId = null) {
      this.carregando = true
      try {
        const params = {
          por_pagina: 100, // Busca todos sem paginação
          ...(formaPagamentoId ? { forma_pagamento_id: formaPagamentoId } : {})
        }

        const { data } = await api.get('/meio-pagamento', { params })

        // Resposta vem paginada: {sucesso, dados: {data: [...], ...}}
        if (data.sucesso) {
          // Se vier paginado, pega data.dados.data, senão pega data.dados
          this.meios = data.dados?.data || data.dados || []
        }

        return data
      } catch (error) {
        console.error('Erro ao listar meios de pagamento:', error)
        throw error
      } finally {
        this.carregando = false
      }
    },

    async buscar(id) {
      this.carregando = true
      try {
        const { data } = await api.get(`/meio-pagamento/${id}`)
        if (data.sucesso) {
          // Atualiza ou adiciona na lista
          const index = this.meios.findIndex((m) => m.id === id)
          if (index >= 0) {
            this.meios[index] = data.dados
          } else {
            this.meios.push(data.dados)
          }
        }
        return data
      } catch (error) {
        console.error('Erro ao buscar meio de pagamento:', error)
        throw error
      } finally {
        this.carregando = false
      }
    },

    async criar(form) {
      this.carregando = true
      try {
        const { data } = await api.post('/meio-pagamento', form)
        if (data.sucesso) {
          this.meios.push(data.dados)
        }
        return data
      } catch (error) {
        console.error('Erro ao criar meio de pagamento:', error)
        throw error
      } finally {
        this.carregando = false
      }
    },

    async atualizar(id, form) {
      this.carregando = true
      try {
        const { data } = await api.put(`/meio-pagamento/${id}`, form)
        if (data.sucesso) {
          const index = this.meios.findIndex((m) => m.id === id)
          if (index >= 0) {
            this.meios[index] = data.dados
          }
        }
        return data
      } catch (error) {
        console.error('Erro ao atualizar meio de pagamento:', error)
        throw error
      } finally {
        this.carregando = false
      }
    },

    async excluir(id) {
      this.carregando = true
      try {
        const { data } = await api.delete(`/meio-pagamento/${id}`)
        if (data.sucesso) {
          const index = this.meios.findIndex((m) => m.id === id)
          if (index >= 0) {
            this.meios.splice(index, 1)
          }
        }
        return data
      } catch (error) {
        console.error('Erro ao excluir meio de pagamento:', error)
        throw error
      } finally {
        this.carregando = false
      }
    },

    limpar() {
      this.meios = []
    },
  },
})
