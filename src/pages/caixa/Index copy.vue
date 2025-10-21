<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h4">Caixas</div>
        <div class="text-subtitle2 text-grey-7">Gerenciamento de caixas e fluxo financeiro</div>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Novo Caixa" @click="openDialog()" />
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input v-model="filters.search" outlined dense placeholder="Buscar por nome..." @keyup.enter="loadCaixas">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-select v-model="filters.status" outlined dense :options="statusOptions" label="Status" emit-value
              map-options clearable />
          </div>

          <div class="col-12 col-md-2">
            <q-input v-model="filters.date_from" outlined dense type="date" label="Data Inicial" />
          </div>

          <div class="col-12 col-md-3">
            <q-btn color="primary" label="Filtrar" icon="filter_list" @click="loadCaixas" class="q-mr-sm" />
            <q-btn flat label="Limpar" @click="clearFilters" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Cards de Caixas -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-4" v-for="caixa in caixas" :key="caixa.id">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="col">
                <div class="text-h6">{{ caixa.name }}</div>
                <div class="text-caption text-grey-7">
                  Aberto em {{ formatDateTime(caixa.opening_date) }}
                </div>
              </div>
              <div class="col-auto">
                <q-chip :color="getStatusColor(caixa.status)" text-color="white" size="sm">
                  {{ getStatusLabel(caixa.status) }}
                </q-chip>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <!-- Valores -->
            <div class="q-gutter-sm">
              <div class="row justify-between">
                <span class="text-grey-7">Saldo Inicial:</span>
                <span class="text-weight-medium">{{ formatCurrency(caixa.initial_balance) }}</span>
              </div>
              <div class="row justify-between">
                <span class="text-grey-7">Entradas:</span>
                <span class="text-positive text-weight-medium">{{ formatCurrency(caixa.total_entradas) }}</span>
              </div>
              <div class="row justify-between">
                <span class="text-grey-7">Saídas:</span>
                <span class="text-negative text-weight-medium">{{ formatCurrency(caixa.total_saidas) }}</span>
              </div>
              <q-separator />
              <div class="row justify-between">
                <span class="text-weight-bold">Saldo Atual:</span>
                <span class="text-h6" :class="caixa.current_balance >= 0 ? 'text-positive' : 'text-negative'">
                  {{ formatCurrency(caixa.current_balance) }}
                </span>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <!-- Usuário -->
            <div class="text-caption text-grey-7">
              <q-icon name="person" size="xs" />
              Responsável: {{ caixa.user_name || 'N/A' }}
            </div>

            <div v-if="caixa.closing_date" class="text-caption text-grey-7 q-mt-xs">
              <q-icon name="event" size="xs" />
              Fechado em {{ formatDateTime(caixa.closing_date) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn v-if="caixa.status === 'aberto'" flat dense color="primary" icon="attach_money" label="Transações"
              @click="viewTransactions(caixa)" />
            <q-btn flat dense color="primary" icon="edit" @click="openDialog(caixa)" />
            <q-btn v-if="caixa.status === 'aberto'" flat dense color="negative" icon="lock" label="Fechar"
              @click="confirmCloseCaixa(caixa)" />
            <q-btn v-if="caixa.status === 'fechado'" flat dense color="grey" icon="description" label="Relatório"
              @click="generateReport(caixa)" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Card vazio -->
      <div v-if="!loading && caixas.length === 0" class="col-12">
        <q-card flat bordered>
          <q-card-section class="text-center q-pa-xl">
            <q-icon name="inventory_2" size="64px" color="grey-5" />
            <div class="text-h6 text-grey-7 q-mt-md">Nenhum caixa encontrado</div>
            <div class="text-caption text-grey-6">Clique em "Novo Caixa" para começar</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner color="primary" size="50px" />
    </div>

    <!-- Paginação -->
    <div v-if="pagination.rowsNumber > pagination.rowsPerPage" class="row justify-center q-mt-md">
      <q-pagination v-model="pagination.page" :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
        :max-pages="6" boundary-numbers @update:model-value="loadCaixas" />
    </div>

    <!-- Dialog de Cadastro/Edição -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ form.id ? 'Editar' : 'Novo' }} Caixa</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-gutter-md">
            <q-input v-model="form.name" outlined label="Nome do Caixa *"
              :rules="[val => !!val || 'Campo obrigatório']" />

            <q-input v-model.number="form.initial_balance" outlined type="number" step="0.01" label="Saldo Inicial *"
              prefix="R$" :rules="[
                val => val !== null && val !== '' || 'Campo obrigatório',
                val => val >= 0 || 'Valor deve ser maior ou igual a zero'
              ]" />

            <q-input v-model="form.opening_date" outlined type="datetime-local" label="Data/Hora de Abertura *"
              :rules="[val => !!val || 'Campo obrigatório']" />

            <q-input v-model="form.description" outlined type="textarea" label="Descrição" rows="3" />

            <q-select v-model="form.status" outlined :options="statusOptions" label="Status *" emit-value map-options
              :rules="[val => !!val || 'Campo obrigatório']" :disable="!!form.id" />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Salvar" @click="saveCaixa" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Fechamento de Caixa -->
    <q-dialog v-model="closeDialog" persistent>
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-h6">Fechar Caixa</div>
          <div class="text-subtitle2 text-grey-7">{{ selectedCaixa?.name }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-gutter-md">
            <div class="row justify-between q-pa-sm bg-grey-2 rounded-borders">
              <span class="text-weight-medium">Saldo Atual:</span>
              <span class="text-h6 text-primary">{{ formatCurrency(selectedCaixa?.current_balance) }}</span>
            </div>

            <q-input v-model.number="closeForm.final_balance" outlined type="number" step="0.01"
              label="Saldo Final (Conferência) *" prefix="R$" hint="Informe o valor real contado no caixa" :rules="[
                val => val !== null && val !== '' || 'Campo obrigatório',
                val => val >= 0 || 'Valor deve ser maior ou igual a zero'
              ]" />

            <div v-if="closeForm.final_balance !== null && closeForm.final_balance !== ''"
              class="q-pa-sm rounded-borders" :class="getDifferenceClass()">
              <div class="text-weight-medium">
                Diferença: {{ formatCurrency(getDifference()) }}
              </div>
              <div class="text-caption">
                {{ getDifference() === 0 ? 'Caixa conferido corretamente!' :
                  getDifference() > 0 ? 'Sobra no caixa' : 'Falta no caixa' }}
              </div>
            </div>

            <q-input v-model="closeForm.closing_date" outlined type="datetime-local" label="Data/Hora de Fechamento *"
              :rules="[val => !!val || 'Campo obrigatório']" />

            <q-input v-model="closeForm.notes" outlined type="textarea" label="Observações" rows="3"
              hint="Adicione observações sobre o fechamento (opcional)" />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="negative" label="Fechar Caixa" icon="lock" @click="closeCaixa" :loading="closing" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios' // Ajuste conforme sua configuração

const $q = useQuasar()
const router = useRouter()

// Estado
const loading = ref(false)
const saving = ref(false)
const closing = ref(false)
const dialog = ref(false)
const closeDialog = ref(false)
const caixas = ref([])
const selectedCaixa = ref(null)

const filters = reactive({
  search: '',
  status: null,
  date_from: ''
})

const pagination = ref({
  page: 1,
  rowsPerPage: 12,
  rowsNumber: 0
})

const form = reactive({
  id: null,
  name: '',
  initial_balance: 0,
  opening_date: '',
  description: '',
  status: 'aberto'
})

const closeForm = reactive({
  final_balance: null,
  closing_date: '',
  notes: ''
})

// Opções
const statusOptions = [
  { label: 'Aberto', value: 'aberto' },
  { label: 'Fechado', value: 'fechado' }
]

// Métodos
const loadCaixas = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.rowsPerPage,
      ...filters
    }

    const response = await api.get('/caixa', { params })

    caixas.value = response.data
    pagination.value.rowsNumber = response.data.meta.total
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar caixas',
      caption: error.response?.data?.message || error.message
    })
  } finally {
    loading.value = false
  }
}

const openDialog = (caixa = null) => {
  if (caixa) {
    Object.assign(form, {
      ...caixa,
      opening_date: caixa.opening_date ? caixa.opening_date.slice(0, 16) : ''
    })
  } else {
    resetForm()
  }
  dialog.value = true
}

const saveCaixa = async () => {
  saving.value = true
  try {
    if (form.id) {
      await api.put(`/caixa/${form.id}`, form)
      $q.notify({
        type: 'positive',
        message: 'Caixa atualizado com sucesso!'
      })
    } else {
      await api.post('/caixa', form)
      $q.notify({
        type: 'positive',
        message: 'Caixa criado com sucesso!'
      })
    }
    dialog.value = false
    loadCaixas()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar caixa',
      caption: error.response?.data?.message || error.message
    })
  } finally {
    saving.value = false
  }
}

const confirmCloseCaixa = (caixa) => {
  selectedCaixa.value = caixa
  closeForm.final_balance = caixa.current_balance
  closeForm.closing_date = new Date().toISOString().slice(0, 16)
  closeForm.notes = ''
  closeDialog.value = true
}

const closeCaixa = async () => {
  closing.value = true
  try {
    await api.post(`/caixa/${selectedCaixa.value.id}/fechar`, closeForm)
    $q.notify({
      type: 'positive',
      message: 'Caixa fechado com sucesso!'
    })
    closeDialog.value = false
    loadCaixas()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao fechar caixa',
      caption: error.response?.data?.message || error.message
    })
  } finally {
    closing.value = false
  }
}

const viewTransactions = (caixa) => {
  router.push({
    name: 'transactions',
    query: { cashier_id: caixa.id }
  })
}

const generateReport = async (caixa) => {
  try {
    $q.notify({
      type: 'info',
      message: 'Gerando relatório...'
    })

    const response = await api.get(`/caixa/${caixa.id}/relatorio`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `relatorio-caixa-${caixa.id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()

    $q.notify({
      type: 'positive',
      message: 'Relatório gerado com sucesso!'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao gerar relatório',
      caption: error.response?.data?.message || error.message
    })
  }
}

const clearFilters = () => {
  filters.search = ''
  filters.status = null
  filters.date_from = ''
  loadCaixas()
}

const resetForm = () => {
  form.id = null
  form.name = ''
  form.initial_balance = 0
  form.opening_date = new Date().toISOString().slice(0, 16)
  form.description = ''
  form.status = 'aberto'
}

const getDifference = () => {
  if (!selectedCaixa.value || closeForm.final_balance === null) return 0
  return closeForm.final_balance - selectedCaixa.value.current_balance
}

const getDifferenceClass = () => {
  const diff = getDifference()
  if (diff === 0) return 'bg-positive-2 text-positive'
  if (diff > 0) return 'bg-warning-2 text-warning'
  return 'bg-negative-2 text-negative'
}

const getStatusColor = (status) => {
  return status === 'aberto' ? 'positive' : 'grey-7'
}

const getStatusLabel = (status) => {
  return status === 'aberto' ? 'Aberto' : 'Fechado'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('pt-BR')
}

// Lifecycle
onMounted(() => {
  loadCaixas()
})
</script>

<style scoped>
.text-positive {
  color: #21BA45;
}

.text-negative {
  color: #C10015;
}

.bg-positive-2 {
  background-color: #C6F6D5;
}

.bg-negative-2 {
  background-color: #FED7D7;
}

.bg-warning-2 {
  background-color: #FEEBC8;
}
</style>