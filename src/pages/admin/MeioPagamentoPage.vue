<template>
  <q-page padding>
    <!-- Header -->
    <div class="oslo-page-header">
      <div class="row items-center justify-between">
        <div>
          <h1 class="oslo-page-title">Meios de Pagamento</h1>
          <p class="oslo-page-subtitle">Gerencie os meios de pagamento disponíveis</p>
        </div>
        <q-btn
          color="primary"
          icon="add"
          label="Novo Meio"
          unelevated
          no-caps
          @click="abrirModal()"
        />
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <v-label label="Filtrar por Forma de Pagamento" />
            <q-select
              v-model="filtroForma"
              :options="opcoesFormas"
              outlined
              dense
              clearable
              @update:model-value="filtrarPorForma"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela -->
    <q-card flat bordered>
      <q-card-section>
        <q-table
          :rows="meiosFiltrados"
          :columns="columns"
          row-key="id"
          :loading="meioPagamentoStore.carregando"
          flat
          hide-bottom
        >
          <template v-slot:body-cell-forma="props">
            <q-td :props="props">
              <q-chip
                v-if="props.value"
                :color="getCorForma(props.value)"
                text-color="white"
                size="sm"
              >
                {{ props.value }}
              </q-chip>
              <span v-else class="text-grey-5">Não vinculado</span>
            </q-td>
          </template>

          <template v-slot:body-cell-taxas="props">
            <q-td :props="props">
              <div v-if="Number(props.row.taxa_percentual) > 0 || Number(props.row.taxa_fixa) > 0">
                <div v-if="Number(props.row.taxa_percentual) > 0">{{ Number(props.row.taxa_percentual).toFixed(2) }}%</div>
                <div v-if="Number(props.row.taxa_fixa) > 0">R$ {{ Number(props.row.taxa_fixa).toFixed(2) }}</div>
              </div>
              <span v-else class="text-grey-5">Sem taxa</span>
            </q-td>
          </template>

          <template v-slot:body-cell-acoes="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="eva-edit-2-outline"
                color="primary"
                size="sm"
                @click="abrirModal(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="eva-trash-2-outline"
                color="negative"
                size="sm"
                @click="confirmarExclusao(props.row)"
              >
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal -->
    <q-dialog v-model="modal" persistent>
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ formEdicao.id ? 'Editar' : 'Novo' }} Meio de Pagamento</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-md">
            <div>
              <v-label label="Nome" obrigatorio />
              <q-input
                v-model="formEdicao.nome"
                outlined
                dense
                placeholder="Ex: Visa Crédito, PIX, Dinheiro"
              />
            </div>

            <div>
              <v-label label="Forma de Pagamento" obrigatorio />
              <q-select
                v-model="formEdicao.forma_pagamento_id"
                :options="formaPagamentoStore.formasAtivas"
                option-value="id"
                option-label="nome"
                emit-value
                map-options
                outlined
                dense
                placeholder="Selecione a forma"
              />
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <v-label label="Taxa Percentual (%)" />
                <q-input
                  v-model.number="formEdicao.taxa_percentual"
                  type="number"
                  outlined
                  dense
                  min="0"
                  step="0.01"
                  suffix="%"
                />
              </div>

              <div class="col-6">
                <v-label label="Taxa Fixa (R$)" />
                <q-input
                  v-model.number="formEdicao.taxa_fixa"
                  type="number"
                  outlined
                  dense
                  min="0"
                  step="0.01"
                  prefix="R$"
                />
              </div>
            </div>

            <div>
              <v-label label="Prazo de Compensação (dias)" />
              <q-input
                v-model.number="formEdicao.prazo_compensacao"
                type="number"
                outlined
                dense
                min="0"
                suffix="dias"
              />
            </div>

            <div>
              <v-label label="Descrição" />
              <q-input
                v-model="formEdicao.descricao"
                type="textarea"
                outlined
                rows="3"
                placeholder="Descrição do meio de pagamento"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
          <q-btn
            label="Salvar"
            color="primary"
            unelevated
            :loading="salvando"
            @click="salvar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useFormaPagamentoStore } from 'src/stores/formaPagamento'
import { useMeioPagamentoStore } from 'src/stores/meioPagamento'

defineOptions({ name: 'MeioPagamentoPage' })

const $q = useQuasar()
const formaPagamentoStore = useFormaPagamentoStore()
const meioPagamentoStore = useMeioPagamentoStore()

const modal = ref(false)
const salvando = ref(false)
const filtroForma = ref(null)

const formEdicao = reactive({
  id: null,
  nome: '',
  forma_pagamento_id: null,
  descricao: '',
  taxa_percentual: 0,
  taxa_fixa: 0,
  prazo_compensacao: 0,
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  {
    name: 'forma',
    label: 'Forma de Pagamento',
    field: (row) => row.forma_pagamento?.nome || null,
    align: 'left',
    sortable: true
  },
  { name: 'taxas', label: 'Taxas', field: 'taxas', align: 'center' },
  {
    name: 'prazo',
    label: 'Prazo',
    field: 'prazo_compensacao',
    align: 'center',
    format: (val) => val > 0 ? `${val} dias` : '-'
  },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const opcoesFormas = computed(() => [
  { label: 'Todas', value: null },
  ...formaPagamentoStore.formasAtivas.map(f => ({ label: f.nome, value: f.id }))
])

const meiosFiltrados = computed(() => {
  if (!filtroForma.value) {
    return meioPagamentoStore.meios
  }
  return meioPagamentoStore.porFormaPagamento(filtroForma.value)
})

onMounted(async () => {
  await Promise.all([
    formaPagamentoStore.listar(),
    meioPagamentoStore.listar()
  ])
})

function abrirModal(meio = null) {
  if (meio) {
    formEdicao.id = meio.id
    formEdicao.nome = meio.nome
    formEdicao.forma_pagamento_id = meio.forma_pagamento_id
    formEdicao.descricao = meio.descricao || ''
    formEdicao.taxa_percentual = meio.taxa_percentual || 0
    formEdicao.taxa_fixa = meio.taxa_fixa || 0
    formEdicao.prazo_compensacao = meio.prazo_compensacao || 0
  } else {
    formEdicao.id = null
    formEdicao.nome = ''
    formEdicao.forma_pagamento_id = null
    formEdicao.descricao = ''
    formEdicao.taxa_percentual = 0
    formEdicao.taxa_fixa = 0
    formEdicao.prazo_compensacao = 0
  }
  modal.value = true
}

async function salvar() {
  if (!formEdicao.nome) {
    $q.notify({
      type: 'negative',
      message: 'O nome é obrigatório',
      position: 'top',
    })
    return
  }

  if (!formEdicao.forma_pagamento_id) {
    $q.notify({
      type: 'negative',
      message: 'A forma de pagamento é obrigatória',
      position: 'top',
    })
    return
  }

  salvando.value = true
  try {
    const dados = {
      nome: formEdicao.nome,
      forma_pagamento_id: formEdicao.forma_pagamento_id,
      descricao: formEdicao.descricao,
      taxa_percentual: formEdicao.taxa_percentual || 0,
      taxa_fixa: formEdicao.taxa_fixa || 0,
      prazo_compensacao: formEdicao.prazo_compensacao || 0,
    }

    if (formEdicao.id) {
      await meioPagamentoStore.atualizar(formEdicao.id, dados)
      $q.notify({
        type: 'positive',
        message: 'Meio de pagamento atualizado com sucesso',
        position: 'top',
      })
    } else {
      await meioPagamentoStore.criar(dados)
      $q.notify({
        type: 'positive',
        message: 'Meio de pagamento criado com sucesso',
        position: 'top',
      })
    }

    modal.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.mensagem || 'Erro ao salvar meio de pagamento',
      position: 'top',
    })
  } finally {
    salvando.value = false
  }
}

function confirmarExclusao(meio) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja excluir o meio de pagamento "${meio.nome}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await meioPagamentoStore.excluir(meio.id)
      $q.notify({
        type: 'positive',
        message: 'Meio de pagamento excluído com sucesso',
        position: 'top',
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.mensagem || 'Erro ao excluir meio de pagamento',
        position: 'top',
      })
    }
  })
}

function filtrarPorForma() {
  // O computed meiosFiltrados já cuida da filtragem
}

function getCorForma(nomeForma) {
  const cores = {
    'Dinheiro': 'green',
    'PIX': 'teal',
    'Cartão de Débito': 'blue',
    'Cartão de Crédito': 'orange',
    'Boleto Bancário': 'purple',
    'Transferência Bancária': 'indigo',
  }
  return cores[nomeForma] || 'grey'
}
</script>

<style lang="scss" scoped>
.oslo-page-header {
  margin-bottom: 24px;
}

.oslo-page-title {
  font-size: 24px;
  font-weight: 700;
  color: #202124;
  margin: 0;
  line-height: 1.3;
}

.oslo-page-subtitle {
  font-size: 14px;
  color: #5F6368;
  margin: 4px 0 0 0;
}
</style>
