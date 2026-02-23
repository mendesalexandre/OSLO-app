import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

const path = '/transacao'

export const useTransacaoStore = defineStore('transacao', () => {
  const transacoes = ref([])
  const transacao  = ref(null)
  const loading    = ref(false)

  const listar = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await api.get(path, { params })
      transacoes.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const criar = async (payload) => {
    const { data } = await api.post(path, payload)
    transacao.value = data
    return data
  }

  const atualizar = async (id, payload) => {
    const { data } = await api.put(`${path}/${id}`, payload)
    transacao.value = data
    return data
  }

  const excluir = async (id) => {
    await api.delete(`${path}/${id}`)
  }

  const pagar = async (id, payload) => {
    const { data } = await api.post(`${path}/${id}/pagar`, payload)
    return data
  }

  const cancelar = async (id) => {
    const { data } = await api.post(`${path}/${id}/cancelar`)
    return data
  }

  return {
    transacoes,
    transacao,
    loading,
    listar,
    criar,
    atualizar,
    excluir,
    pagar,
    cancelar,
  }
})
