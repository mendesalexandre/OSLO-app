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
              <v-date v-model="filters.date_from" outlined dense />
            </div>

            <!-- <div class="col-12 col-md-2">
              <v-label label="Data Final"></v-label>
              <q-input v-model="filters.date_to" outlined dense type="date" />
            </div> -->

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
            <div class="col-md-12 col-sm-12 col-xs-12 grupo-tipo-protocolo">
              <v-label label="Tipo de Lançamento" obrigatorio />
              <q-btn-toggle dense v-model="form.tipo" :options="tiposLancamento" spread unelevated
                class="tipo-protocolo" />
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <v-label label="Valor" obrigatorio />
                <v-money v-model.number="form.valor" outlined type="number" dense />
              </div>

              <div class="col-md-12 col-sm-12 col-xs-12">
                <v-label label="Descrição" obrigatorio />
                <q-input v-model="form.descricao" outlined type="textarea" rows="3"
                  :rules="[val => !!val || 'Campo obrigatório']" hide-bottom-space />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <v-label label="Categoria" obrigatorio />
                <v-select v-model="form.categoria_id" outlined dense :options="categorias" option-value="id"
                  option-label="nome" emit-value map-options />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <v-label label="Data" obrigatorio />
                <v-date v-model="form.data" outlined :rules="[val => !!val || 'Campo obrigatório']" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <v-label label="Caixa" obrigatorio />
                <v-select v-model="form.caixa_id" outlined :options="caixas" dense option-value="id" option-label="nome"
                  emit-value map-options :rules="[val => !!val || 'Campo obrigatório']" />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <template #rodape>
          <!-- <q-card-section class="flex justify-end bg-grey-3">
            <q-btn outline label="Cancelar" />
            <q-btn color="primary" label="Salvar" @click="saveTransaction" :loading="saving" outline />
          </q-card-section> -->
          <q-card-section>
            <div class="flex justify-between">
              <div>
                <q-btn label="Cancelar" color="negative" outline @click="cancelar" :disable="salvando" />
              </div>
              <div>
                <q-btn label="Salvar" color="primary" @click="saveTransaction" outline :loading="saving">
                  <template v-slot:loading>
                    <q-spinner class="q-mr-sm" />
                    Salvando...
                  </template>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </template>
      </modal>
    </q-page>
  </template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useNaturezaStore } from 'src/stores/natureza'
import { useCategoriaStore } from 'src/stores/categoria'
import { useCaixaStore } from 'src/stores/caixa'
import { storeToRefs } from 'pinia'

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
  categoria_id: null,
  caixa_id: null,
  tipo: 'ENTRADA',
  valor: null,
  descricao: '',
  data: new Date().toISOString().split('T')[0]
})

// Opções
const typeOptions = [
  { label: 'Entrada', value: 'ENTRADA' },
  { label: 'Saída', value: 'SAIDA' }
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
    // if (form.id) {
    //   await api.put(`/transacao/${form.id}`, {
    //     id: form.id,
    //     categoria_id: form.categoria_id,
    //     caixa_id: form.caixa_id,
    //     tipo: form.tipo,
    //     valor: form.valor,
    //     descricao: form.descricao,
    //     data: form.data
    //   })
    //   $q.notify({
    //     type: 'positive',
    //     message: 'Transação atualizada com sucesso!'
    //   })
    // } else {

    //   $q.notify({
    //     type: 'positive',
    //     message: 'Transação criada com sucesso!'
    //   })
    await api.post(`/transacao`, {
      categoria_id: form.categoria_id,
      caixa_id: form.caixa_id,
      tipo: form.tipo,
      valor: form.valor,
      descricao: form.descricao,
      data: form.data
    })
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
  // form.id = null
  form.tipo = 'ENTRADA'
  form.amount = null
  form.descricao = ''
  form.categoria_id = null
  form.data = new Date().toISOString().split('T')[0]
  form.caixa_id = null
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

const categoriaStore = useCategoriaStore();
const { categorias } = storeToRefs(categoriaStore);
const caixaStore = useCaixaStore();
const { caixas } = storeToRefs(caixaStore);
const naturezaStore = useNaturezaStore();

const tiposLancamento = computed(() => [
  {
    label: 'Entrada',
    value: 'ENTRADA',
    icon: 'fa-regular fa-circle-down',
    color: 'positive',
    class: 'btn-entrada'
  },
  {
    label: 'Saída',
    value: 'SAIDA',
    icon: 'fa-regular fa-circle-up',
    // color: 'negative',
    class: 'btn-saida'
  },
  // {
  //   label: 'Ajuste',
  //   value: 'AJUSTE',
  //   icon: 'fa-regular fa-pen-to-square',
  //   // color: 'warning',
  //   class: 'btn-ajuste'
  // },
  {
    label: 'Sangria',
    value: 'SANGRIA',
    icon: 'fa-regular fa-money-bill-wave',
    // color: 'orange',
    class: 'btn-sangria'
  },
  {
    label: 'Transferência',
    value: 'TRANSFERENCIA',
    icon: 'fa-regular fa-right-left',
    // color: 'info',
    class: 'btn-transferencia'
  },
])

// Lifecycle
onMounted(async () => {
  loadTransactions()
  loadCashiers()
  await categoriaStore.index()
  await caixaStore.index()
})
</script>
<style scoped lang="scss">
.text-positive {
  color: #21BA45;
}

.text-negative {
  color: #C10015;
}

.grupo-tipo-protocolo {
  :deep(.q-btn) {
    // color: #37474f;
    border-radius: 2px !important;
    border: 1px solid #e0e0e0 !important;

    .q-btn__content {
      padding: 0;
      margin: 0;
    }

    .q-icon {
      font-size: 14px;
    }

    &.q-btn--outline {
      // border: 1px solid #e0e0e0;
      // background-color: white;
    }

    // &[aria-pressed="true"] {
    //   // border-color: $primary !important;
    // }

    .q-focus-helper {
      // background-color: currentColor;
      opacity: 0;
      border-radius: inherit;
    }

    &:hover .q-focus-helper {
      opacity: 0.1;
    }
  }

  // Mover os estilos customizados para dentro do .grupo-tipo-protocolo
  .tipo-protocolo {
    :deep(.btn-entrada) {
      color: var(--q-positive) !important;
      border: 1px solid var(--q-positive) !important;
      background-color: white !important;
      border: 1px solid var(--q-positive) !important;

      &.q-btn--active {
        background-color: var(--q-positive) !important;
        color: white !important;
      }

      &[aria-pressed="true"] {
        background-color: var(--q-positive) !important;
        color: white !important;
      }
    }

    :deep(.btn-saida) {
      // color: var(--q-negative) !important;
      border: 1px solid var(--q-negative) !important;
      color: var(--q-negative) !important;

      &.q-btn--active {
        background-color: var(--q-negative) !important;
        color: white !important;
      }

      &[aria-pressed="true"] {
        background-color: var(--q-negative) !important;
        color: white !important;
      }
    }

    :deep(.btn-ajuste) {
      color: var(--q-warning) !important;
      border: 1px solid var(--q-warning) !important;

      &.q-btn--active {
        background-color: var(--q-warning) !important;
        color: white !important;
      }

      &[aria-pressed="true"] {
        background-color: var(--q-warning) !important;
        color: white !important;
      }
    }

    :deep(.btn-sangria) {
      color: orange !important;
      border: 1px solid orange !important;

      &.q-btn--active {
        background-color: orange !important;
        color: white !important;
      }

      &[aria-pressed="true"] {
        background-color: orange !important;
        color: white !important;
      }
    }

    :deep(.btn-transferencia) {
      color: var(--q-info) !important;
      border: 1px solid var(--q-info) !important;

      &.q-btn--active {
        background-color: var(--q-info) !important;
        color: white !important;
      }

      &[aria-pressed="true"] {
        background-color: var(--q-info) !important;
        color: white !important;
      }
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
