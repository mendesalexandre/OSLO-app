import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

const path = '/caixa-movimento'

export const useCaixaMovimentoStore = defineStore('caixaMovimento', () => {
  const movimentos = ref([])
  const movimento  = ref(null)
  const loading    = ref(false)

  const listar = async () => {
    loading.value = true
    try {
      const { data } = await api.get(path)
      movimentos.value = data
    } finally {
      loading.value = false
    }
  }

  const listarAbertos = async () => {
    const { data } = await api.get(`${path}/status/abertos`)
    return data
  }

  const buscar = async (id) => {
    const { data } = await api.get(`${path}/${id}`)
    movimento.value = data.movimento ?? data
    return movimento.value
  }

  const abrir = async (payload) => {
    const { data } = await api.post(`${path}/abrir`, payload)
    return data
  }

  const fechar = async (id, payload) => {
    const { data } = await api.post(`${path}/${id}/fechar`, payload)
    return data
  }

  const conferir = async (id) => {
    const { data } = await api.post(`${path}/${id}/conferir`)
    return data
  }

  const reabrir = async (id, motivo) => {
    const { data } = await api.post(`${path}/${id}/reabrir`, { motivo })
    return data
  }

  const movimentoAtual = async (caixaId) => {
    const { data } = await api.get(`/caixa/${caixaId}/movimento-atual`)
    return data
  }

  return {
    movimentos,
    movimento,
    loading,
    listar,
    listarAbertos,
    buscar,
    abrir,
    fechar,
    conferir,
    reabrir,
    movimentoAtual,
  }
})
