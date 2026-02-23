import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useTipoPagamentoStore = defineStore('tipoPagamento', () => {
  const tipos   = ref([])
  const loading = ref(false)

  const listar = async () => {
    if (tipos.value.length > 0) return // cache simples
    loading.value = true
    try {
      const { data } = await api.get('/tipo-pagamento')
      tipos.value = data.dados ?? data
    } finally {
      loading.value = false
    }
  }

  return { tipos, loading, listar }
})
