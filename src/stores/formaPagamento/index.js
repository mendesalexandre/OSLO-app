import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useFormaPagamentoStore = defineStore('formaPagamento', {
  state: () => ({
    formas: [],
    carregando: false,
  }),

  getters: {
    formasAtivas: (state) => state.formas.filter((f) => f.ativo),

    porId: (state) => (id) => state.formas.find((f) => f.id === id),
  },

  actions: {
    async listar() {
      this.carregando = true
      try {
        const { data } = await api.get('/forma-pagamento', {
          params: { por_pagina: 100 } // Busca todas sem paginação
        })

        // Resposta vem paginada: {sucesso, dados: {data: [...], ...}}
        if (data.sucesso) {
          // Se vier paginado, pega data.dados.data, senão pega data.dados
          this.formas = data.dados?.data || data.dados || []
        }

        return data
      } catch (error) {
        console.error('Erro ao listar formas de pagamento:', error)
        throw error
      } finally {
        this.carregando = false
      }
    },

    async buscar(id) {
      this.carregando = true
      try {
        const { data } = await api.get(`/forma-pagamento/${id}`)
        if (data.sucesso) {
          // Atualiza ou adiciona na lista
          const index = this.formas.findIndex((f) => f.id === id)
          if (index >= 0) {
            this.formas[index] = data.dados
          } else {
            this.formas.push(data.dados)
          }
        }
        return data
      } catch (error) {
        console.error('Erro ao buscar forma de pagamento:', error)
        throw error
      } finally {
        this.carregando = false
      }
    },

    async criar(form) {
      this.carregando = true
      try {
        const { data } = await api.post('/forma-pagamento', form)
        if (data.sucesso) {
          this.formas.push(data.dados)
        }
        return data
      } catch (error) {
        console.error('Erro ao criar forma de pagamento:', error)
        throw error
      } finally {
        this.carregando = false
      }
    },

    async atualizar(id, form) {
      this.carregando = true
      try {
        const { data } = await api.put(`/forma-pagamento/${id}`, form)
        if (data.sucesso) {
          const index = this.formas.findIndex((f) => f.id === id)
          if (index >= 0) {
            this.formas[index] = data.dados
          }
        }
        return data
      } catch (error) {
        console.error('Erro ao atualizar forma de pagamento:', error)
        throw error
      } finally {
        this.carregando = false
      }
    },

    async excluir(id) {
      this.carregando = true
      try {
        const { data } = await api.delete(`/forma-pagamento/${id}`)
        if (data.sucesso) {
          const index = this.formas.findIndex((f) => f.id === id)
          if (index >= 0) {
            this.formas.splice(index, 1)
          }
        }
        return data
      } catch (error) {
        console.error('Erro ao excluir forma de pagamento:', error)
        throw error
      } finally {
        this.carregando = false
      }
    },

    limpar() {
      this.formas = []
    },
  },
})
