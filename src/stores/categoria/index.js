import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

const path = '/categoria'

export const useCategoriaStore = defineStore('categoria', () => {
  const categorias = ref([])   // árvore: pai com subcategorias[]
  const categoria  = ref(null)
  const loading    = ref(false)

  // Retorna árvre completa (pai + subcategorias)
  const listar = async () => {
    loading.value = true
    try {
      const { data } = await api.get(path)
      categorias.value = data.dados ?? data
    } finally {
      loading.value = false
    }
  }

  // Retorna todas as categorias ativas em árvore — para selects
  const listarAtivas = async () => {
    const { data } = await api.get('/categoria-todas')
    return data.dados ?? data
  }

  const criar = async (payload) => {
    const { data } = await api.post(path, payload)
    categoria.value = data.dados ?? data
    return categoria.value
  }

  const atualizar = async (id, payload) => {
    const { data } = await api.put(`${path}/${id}`, payload)
    categoria.value = data.dados ?? data
    return categoria.value
  }

  const excluir = async (id) => {
    await api.delete(`${path}/${id}`)
  }

  return { categorias, categoria, loading, listar, listarAtivas, criar, atualizar, excluir }
})
