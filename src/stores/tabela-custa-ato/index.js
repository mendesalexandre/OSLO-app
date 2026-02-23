import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

const path = '/tabela-custa-ato'

export const useTabelaCustaAto = defineStore('tabela-custa-ato', () => {
  const atos    = ref([])
  const ato     = ref(null)
  const loading = ref(false)

  // ── Actions ─────────────────────────────────────────────────────────────────

  const listar = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await api.get(path, { params })
      atos.value = data.dados ?? data
      return atos.value
    } finally {
      loading.value = false
    }
  }

  const buscar = async (uuid) => {
    const { data } = await api.get(`${path}/${uuid}`)
    ato.value = data.dados ?? data
    return ato.value
  }

  const atualizar = async (uuid, payload) => {
    const { data } = await api.put(`${path}/${uuid}`, payload)
    ato.value = data.dados ?? data
    return ato.value
  }

  const calcular = async (uuid, payload) => {
    const { data } = await api.post(`${path}/${uuid}/calcular`, payload)
    return data.dados ?? data
  }

  return {
    atos,
    ato,
    loading,
    listar,
    buscar,
    atualizar,
    calcular,
  }
})
