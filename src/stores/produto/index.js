import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

const path = '/produto'

export const useProdutoStore = defineStore('produto', () => {
  const produtos = ref([])
  const produto  = ref(null)
  const loading  = ref(false)

  // ── Actions ──────────────────────────────────────────────────────────────────

  const listar = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await api.get(path, { params })
      produtos.value = data.dados?.data ?? data.dados ?? data
      return data.dados
    } finally {
      loading.value = false
    }
  }

  const buscar = async (uuid) => {
    const { data } = await api.get(`${path}/${uuid}`)
    produto.value = data.dados ?? data
    return produto.value
  }

  const criar = async (payload) => {
    const { data } = await api.post(path, payload)
    produto.value = data.dados ?? data
    return produto.value
  }

  const atualizar = async (uuid, payload) => {
    const { data } = await api.put(`${path}/${uuid}`, payload)
    produto.value = data.dados ?? data
    return produto.value
  }

  const excluir = async (uuid) => {
    await api.delete(`${path}/${uuid}`)
  }

  const calcular = async (uuid, payload) => {
    const { data } = await api.post(`${path}/${uuid}/calcular`, payload)
    return data.dados ?? data
  }

  return {
    produtos,
    produto,
    loading,
    listar,
    buscar,
    criar,
    atualizar,
    excluir,
    calcular,
  }
})
