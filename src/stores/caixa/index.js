import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

const path = '/caixa'

export const useCaixaStore = defineStore('caixa', () => {
  const caixas  = ref([])
  const caixa   = ref(null)
  const loading = ref(false)

  const listar = async () => {
    loading.value = true
    try {
      const { data } = await api.get(path)
      caixas.value = data
    } finally {
      loading.value = false
    }
  }

  const criar = async (payload) => {
    const { data } = await api.post(path, payload)
    caixa.value = data
    return data
  }

  const atualizar = async (id, payload) => {
    const { data } = await api.put(`${path}/${id}`, payload)
    caixa.value = data
    return data
  }

  const excluir = async (id) => {
    await api.delete(`${path}/${id}`)
  }

  return { caixas, caixa, loading, listar, criar, atualizar, excluir }
})
