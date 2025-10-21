<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h4">Transações</div>
        <div class="text-subtitle2 text-grey-7">Gerenciamento de entradas e saídas</div>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nova Transação" @click="openDialog()" />
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <v-label label="Buscar"></v-label>
            <q-input v-model="filters.search" outlined dense placeholder="Buscar..." @keyup.enter="loadTransactions">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <v-label label="Tipo"></v-label>
            <q-select v-model="filters.type" outlined dense :options="typeOptions" emit-value map-options clearable />
          </div>

          <div class="col-12 col-md-2">
            <v-label label="Data Inicial"></v-label>
            <q-input v-model="filters.date_from" outlined dense type="date" />
          </div>

          <div class="col-12 col-md-2">
            <v-label label="Data Final"></v-label>
            <q-input v-model="filters.date_to" outlined dense type="date" />
          </div>

          <div class="col-12 col-md-3">
            <q-btn color="primary" label="Filtrar" icon="filter_list" @click="loadTransactions" class="q-mr-sm" />
            <q-btn flat label="Limpar" @click="clearFilters" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Resumo -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Total Entradas</div>
            <div class="text-h5 text-positive">{{ formatCurrency(summary.total_entradas) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Total Saídas</div>
            <div class="text-h5 text-negative">{{ formatCurrency(summary.total_saidas) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Saldo</div>
            <div class="text-h5" :class="summary.saldo >= 0 ? 'text-positive' : 'text-negative'">
              {{ formatCurrency(summary.saldo) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabela -->
    <q-card flat bordered>
      <q-table :rows="transactions" :columns="columns" row-key="id" :loading="loading" :pagination="pagination"
        @request="onRequest" flat>
        <template #header-cell="props">
          <q-th :props="props" class="text-uppercase text-weight-medium tabela-cabecalho text-blue-grey-8">
            {{ props.col.label }}
          </q-th>
        </template>
        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-chip :color="props.row.type === 'entrada' ? 'positive' : 'negative'" text-color="white" size="sm">
              {{ props.row.type === 'entrada' ? 'Entrada' : 'Saída' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <span :class="props.row.type === 'entrada' ? 'text-positive' : 'text-negative'">
              {{ formatCurrency(props.row.amount) }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-date="props">
          <q-td :props="props">
            {{ formatDate(props.row.date) }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense round icon="edit" size="sm" color="primary" @click="openDialog(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat dense round icon="delete" size="sm" color="negative" @click="confirmDelete(props.row)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog de Cadastro/Edição -->
    <modal v-model="dialog" tamanho="md" titulo="Transação" @close="fecharModal">
      <q-card bordered>
        <q-card-section>
          <!-- Tipo de Lançamento -->
          <div class="col-12 grupo-tipo-protocolo">
            <v-label label="Tipo de Lançamento" obrigatorio />
            <q-btn-toggle v-model="form.type" :options="[
              { label: 'Entrada', value: 'ENTRADA', icon: 'fa-regular fa-file' },
              { label: 'Saída', value: 'SAIDA', icon: 'fa-regular fa-calculator' },
            ]" spread unelevated class="tipo-protocolo" />
          </div>
        </q-card-section>
        <q-card-section>

          <money v-model.number="form.amount" outlined type="number" step="0.01" />

          <q-input v-model="form.description" outlined type="textarea" label="Descrição *" rows="3"
            :rules="[val => !!val || 'Campo obrigatório']" />

          <q-input v-model="form.category" outlined label="Categoria" />

          <q-input v-model="form.date" outlined type="date" label="Data *"
            :rules="[val => !!val || 'Campo obrigatório']" />

          <q-select v-model="form.cashier_id" outlined :options="cashiers" option-value="id" option-label="name"
            emit-value map-options label="Caixa *" :rules="[val => !!val || 'Campo obrigatório']" />

        </q-card-section>


      </q-card>

      <template #rodape>
        <q-card-section align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Salvar" @click="saveTransaction" :loading="saving" />
        </q-card-section>
      </template>
    </modal>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()

// Estado
const loading = ref(false)
const saving = ref(false)
const dialog = ref(false)
const transactions = ref([])
const cashiers = ref([])
const fecharModal = () => {
  dialog.value = !dialog.value
}

const filters = reactive({
  search: '',
  type: null,
  date_from: '',
  date_to: ''
})

const summary = reactive({
  total_entradas: 0,
  total_saidas: 0,
  saldo: 0
})

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const form = reactive({
  id: null,
  type: 'entrada',
  amount: null,
  description: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  cashier_id: null
})

// Opções
const typeOptions = [
  { label: 'Entrada', value: 'entrada' },
  { label: 'Saída', value: 'saida' }
]

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
  },
  {
    name: 'data_cadastro',
    label: 'Data',
    field: 'data_cadastro',
    align: 'left',
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'center',
  },
  {
    name: 'descricao',
    label: 'Descrição',
    field: 'descricao',
    align: 'left'
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
    align: 'left'
  },
  {
    name: 'amount',
    label: 'Valor',
    field: 'amount',
    align: 'right',
  },
  {
    name: 'usuario',
    label: 'Usuário',
    field: 'usuario',
    align: 'left'
  },
  {
    name: 'actions',
    label: 'Ações',
    align: 'center'
  }
]

// Métodos
const loadTransactions = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.rowsPerPage,
      ...filters
    }

    const response = await api.get('/transacao', { params })

    transactions.value = response.data
    pagination.value.rowsNumber = response.data.meta.total

    // Atualizar resumo
    summary.total_entradas = response.data.summary?.total_entradas || 0
    summary.total_saidas = response.data.summary?.total_saidas || 0
    summary.saldo = response.data.summary?.saldo || 0
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar transações',
      caption: error.response?.data?.message || error.message
    })
  } finally {
    loading.value = false
  }
}

const loadCashiers = async () => {
  try {
    const response = await api.get('/caixa')
    cashiers.value = response.data.data
  } catch (error) {
    console.error('Erro ao carregar caixas:', error)
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  loadTransactions()
}

const openDialog = (transaction = null) => {
  if (transaction) {
    Object.assign(form, transaction)
  } else {
    resetForm()
  }
  dialog.value = true
}

const saveTransaction = async () => {
  saving.value = true
  try {
    if (form.id) {
      await api.put(`/transactions/${form.id}`, form)
      $q.notify({
        type: 'positive',
        message: 'Transação atualizada com sucesso!'
      })
    } else {
      await api.post('/transactions', form)
      $q.notify({
        type: 'positive',
        message: 'Transação criada com sucesso!'
      })
    }
    dialog.value = false
    loadTransactions()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar transação',
      caption: error.response?.data?.message || error.message
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (transaction) => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir a transação "${transaction.description}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/transactions/${transaction.id}`)
      $q.notify({
        type: 'positive',
        message: 'Transação excluída com sucesso!'
      })
      loadTransactions()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir transação',
        caption: error.response?.data?.message || error.message
      })
    }
  })
}

const clearFilters = () => {
  filters.search = ''
  filters.type = null
  filters.date_from = ''
  filters.date_to = ''
  loadTransactions()
}

const resetForm = () => {
  form.id = null
  form.type = 'entrada'
  form.amount = null
  form.description = ''
  form.category = ''
  form.date = new Date().toISOString().split('T')[0]
  form.cashier_id = null
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
}

// Lifecycle
onMounted(() => {
  loadTransactions()
  loadCashiers()
})
</script>

<style scoped lang="scss">
.text-positive {
  color: #21BA45;
}

.text-negative {
  color: #C10015;
}


.corpo-secao {
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  // border-radius: 2px;

  .titulo-secao {
    font-size: 0.875rem;
    font-weight: 500;
    color: #37474f;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .q-icon {
    color: #607d8b;
    font-size: 1rem;
  }
}

.grupo-tipo-protocolo {
  :deep(.q-btn) {
    color: #37474f;
    border-radius: 2px !important;
    border: 1px solid #e0e0e0 !important;
    // padding: 8px 16px;
    /* ajuste conforme necessário */

    .q-btn__content {
      padding: 0;
      margin: 0;
    }

    .q-icon {
      font-size: 16px;
    }

    &.q-btn--outline {
      border: 1px solid #e0e0e0;
      background-color: white;
    }

    /* Botão selecionado - quando tem bg-primary */
    &.bg-primary {
      border-color: $primary !important;
    }

    /* Alternativa usando aria-pressed */
    &[aria-pressed="true"] {
      border-color: $primary !important;
    }

    /* Ajusta o q-focus-helper para cobrir 100% */
    .q-focus-helper {
      background-color: currentColor;
      opacity: 0;
      border-radius: inherit;
    }

    /* Hover */
    &:hover .q-focus-helper {
      opacity: 0.1;
    }
  }
}

:deep(.q-btn-group) {
  column-gap: 4px !important;
}


:deep(.q-field__focusable-action) {
  font-size: 20px !important;
}
</style>