import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

const path = '/caixa-operacao'

export const useCaixaOperacaoStore = defineStore('caixaOperacao', () => {
  const operacoes = ref([])
  const loading   = ref(false)

  const porCaixa = async (caixaId) => {
    loading.value = true
    try {
      const { data } = await api.get(`${path}/caixa/${caixaId}`)
      operacoes.value = data.operacoes ?? data
      return data
    } finally {
      loading.value = false
    }
  }

  const sangria = async (payload) => {
    const { data } = await api.post(`${path}/sangria`, payload)
    return data
  }

  const reforco = async (payload) => {
    const { data } = await api.post(`${path}/reforco`, payload)
    return data
  }

  const transferir = async (payload) => {
    const { data } = await api.post(`${path}/transferir`, payload)
    return data
  }

  const estornar = async (id) => {
    const { data } = await api.post(`${path}/${id}/estornar`)
    return data
  }

  return {
    operacoes,
    loading,
    porCaixa,
    sangria,
    reforco,
    transferir,
    estornar,
  }
})
