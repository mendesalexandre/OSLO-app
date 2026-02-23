<template>
  <q-page padding>

    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="oslo-page-title">Transações</div>
        <div class="oslo-page-subtitle">Entradas e saídas financeiras</div>
      </div>
      <div class="col-auto">
        <q-btn
          v-permissao="'TRANSACAO_CRIAR'"
          unelevated color="primary" no-caps
          @click="abrirModalCriar"
        >
          <l-icon name="plus" :size="16" class="q-mr-sm" />
          Nova Transação
        </q-btn>
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="q-py-sm">
        <div class="row q-col-gutter-md items-end">

          <div class="col-12 col-sm-5 col-md-4">
            <v-label label="Buscar" />
            <q-input
              v-model="filtros.busca"
              outlined dense clearable
              placeholder="Descrição..."
              @update:model-value="buscarDebounce"
            >
              <template #prepend><l-icon name="search" :size="14" /></template>
            </q-input>
          </div>

          <div class="col-12 col-sm-3 col-md-2">
            <v-label label="Tipo" />
            <q-select
              v-model="filtros.tipo"
              :options="tiposOpcoes"
              option-value="value" option-label="label"
              emit-value map-options
              outlined dense clearable
              @update:model-value="buscar"
            />
          </div>

          <div class="col-12 col-sm-4 col-md-2">
            <v-label label="Status" />
            <q-select
              v-model="filtros.status"
              :options="statusOpcoes"
              option-value="value" option-label="label"
              emit-value map-options
              outlined dense clearable
              @update:model-value="buscar"
            />
          </div>

          <div class="col-12 col-sm-4 col-md-2">
            <v-label label="Caixa" />
            <q-select
              v-model="filtros.caixa_id"
              :options="caixaStore.caixas"
              option-value="id" option-label="nome"
              emit-value map-options
              outlined dense clearable
              @update:model-value="buscar"
            />
          </div>

        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela -->
    <q-card flat bordered>
      <q-table
        :rows="transacaoStore.transacoes"
        :columns="colunas"
        :loading="transacaoStore.loading"
        row-key="id"
        flat
        hide-bottom
        :rows-per-page-options="[0]"
        no-data-label="Nenhuma transação encontrada"
        loading-label="Carregando..."
      >

        <template #body-cell-tipo="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.tipo === 'ENTRADA' ? 'positive' : 'negative'"
              :label="props.row.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'"
            />
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="statusCor(props.row.status)" :label="statusLabel(props.row.status)" />
          </q-td>
        </template>

        <template #body-cell-valor="props">
          <q-td :props="props" class="text-right">
            <span :class="props.row.tipo === 'ENTRADA' ? 'text-positive' : 'text-negative'" class="text-weight-medium">
              {{ formatCurrency(props.row.valor) }}
            </span>
          </q-td>
        </template>

        <template #body-cell-data_vencimento="props">
          <q-td :props="props">{{ formatData(props.row.data_vencimento) }}</q-td>
        </template>

        <template #body-cell-acoes="props">
          <q-td :props="props" auto-width>
            <div class="row no-wrap q-gutter-x-xs justify-end">

              <!-- Pagar -->
              <q-btn
                v-if="props.row.status === 'PENDENTE'"
                v-permissao="'TRANSACAO_EDITAR'"
                flat dense round color="positive" size="sm"
                @click="abrirPagar(props.row)"
              >
                <l-icon name="dollar-sign" :size="16" />
                <q-tooltip>Pagar</q-tooltip>
              </q-btn>

              <!-- Editar -->
              <q-btn
                v-permissao="'TRANSACAO_EDITAR'"
                flat dense round color="grey-7" size="sm"
                @click="abrirModalEditar(props.row)"
              >
                <l-icon name="pen" :size="16" />
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <!-- Cancelar -->
              <q-btn
                v-if="props.row.status !== 'CANCELADO'"
                v-permissao="'TRANSACAO_EDITAR'"
                flat dense round color="orange-8" size="sm"
                @click="confirmarCancelar(props.row)"
              >
                <l-icon name="x-circle" :size="16" />
                <q-tooltip>Cancelar</q-tooltip>
              </q-btn>

              <!-- Excluir -->
              <q-btn
                v-permissao="'TRANSACAO_EXCLUIR'"
                flat dense round color="negative" size="sm"
                @click="confirmarExcluir(props.row)"
              >
                <l-icon name="trash-2" :size="16" />
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>

            </div>
          </q-td>
        </template>

      </q-table>
    </q-card>

    <!-- Modal Criar/Editar -->
    <ModalTransacao
      v-model="modalAberto"
      :transacao="transacaoSelecionada"
      @salvo="buscar"
    />

    <!-- Modal Pagar -->
    <modal
      v-model="modalPagarAberto"
      titulo="Registrar Pagamento"
      tamanho="sm"
      @close="modalPagarAberto = false"
    >
      <div class="q-gutter-md" v-if="transacaoParaPagar">

        <!-- Resumo -->
        <div class="row justify-between text-body2 q-pa-sm rounded-borders" style="background: var(--surface)">
          <span style="color: var(--text-secondary)">{{ transacaoParaPagar.descricao }}</span>
          <span class="text-weight-bold">{{ formatCurrency(transacaoParaPagar.valor) }}</span>
        </div>

        <!-- Tipo de pagamento -->
        <div>
          <v-label label="Forma de Pagamento *" />
          <q-select
            v-model="formPagar.tipo_pagamento_id"
            :options="tipoPagamentoStore.tipos"
            option-value="id"
            option-label="nome"
            emit-value map-options
            outlined dense
            :loading="tipoPagamentoStore.loading"
            :rules="[v => !!v || 'Obrigatório']"
          >
            <template #prepend><l-icon name="credit-card" :size="14" /></template>
          </q-select>
        </div>

        <!-- Valor -->
        <div>
          <v-label label="Valor a Pagar *" />
          <v-money v-model.number="formPagar.valor_pago" outlined dense />
        </div>

        <!-- Observação -->
        <div>
          <v-label label="Observação" />
          <q-input v-model="formPagar.observacao" outlined dense type="textarea" rows="2" autogrow />
        </div>

      </div>
      <template #rodape>
        <div class="row justify-end q-gutter-sm">
          <q-btn flat no-caps label="Cancelar" @click="modalPagarAberto = false" />
          <q-btn unelevated color="positive" no-caps :loading="pagando" @click="registrarPagamento">
            <l-icon name="check" :size="16" class="q-mr-sm" />
            Confirmar Pagamento
          </q-btn>
        </div>
      </template>
    </modal>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useTransacaoStore } from 'src/stores/transacao'
import { useCaixaStore } from 'src/stores/caixa'
import { useTipoPagamentoStore } from 'src/stores/tipoPagamento'
import ModalTransacao from 'src/components/transacao/ModalTransacao.vue'

defineOptions({ name: 'TransacaoIndex' })

const $q                 = useQuasar()
const transacaoStore     = useTransacaoStore()
const caixaStore         = useCaixaStore()
const tipoPagamentoStore = useTipoPagamentoStore()

// ── Estado ────────────────────────────────────────────────────────────────────
const modalAberto         = ref(false)
const modalPagarAberto    = ref(false)
const transacaoSelecionada = ref(null)
const transacaoParaPagar  = ref(null)
const pagando             = ref(false)

const formPagar = ref({ valor_pago: 0, tipo_pagamento_id: null, observacao: '' })

const filtros = ref({
  busca:    '',
  tipo:     null,
  status:   null,
  caixa_id: null,
})

// ── Opções ────────────────────────────────────────────────────────────────────
const tiposOpcoes = [
  { value: 'ENTRADA', label: 'Entrada' },
  { value: 'SAIDA',   label: 'Saída'   },
]

const statusOpcoes = [
  { value: 'PENDENTE',  label: 'Pendente'  },
  { value: 'PAGO',      label: 'Pago'      },
  { value: 'CANCELADO', label: 'Cancelado' },
]

const colunas = [
  { name: 'id',              label: 'ID',          field: 'id',              align: 'left',  sortable: true },
  { name: 'tipo',            label: 'Tipo',         field: 'tipo',            align: 'center'               },
  { name: 'descricao',       label: 'Descrição',    field: 'descricao',       align: 'left',  sortable: true },
  { name: 'valor',           label: 'Valor',        field: 'valor',           align: 'right', sortable: true },
  { name: 'status',          label: 'Status',       field: 'status',          align: 'center'               },
  { name: 'data_vencimento', label: 'Vencimento',   field: 'data_vencimento', align: 'left'                 },
  { name: 'acoes',           label: '',             field: 'acoes',           align: 'right'                },
]

// ── Busca ─────────────────────────────────────────────────────────────────────
let debounceTimer = null

const buscarDebounce = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(buscar, 400)
}

const buscar = async () => {
  const params = {}
  if (filtros.value.busca)             params.busca    = filtros.value.busca
  if (filtros.value.tipo !== null)     params.tipo     = filtros.value.tipo
  if (filtros.value.status !== null)   params.status   = filtros.value.status
  if (filtros.value.caixa_id !== null) params.caixa_id = filtros.value.caixa_id
  await transacaoStore.listar(params)
}

// ── Modais ────────────────────────────────────────────────────────────────────
const abrirModalCriar = () => {
  transacaoSelecionada.value = null
  modalAberto.value          = true
}

const abrirModalEditar = (t) => {
  transacaoSelecionada.value = t
  modalAberto.value          = true
}

const abrirPagar = async (t) => {
  transacaoParaPagar.value = t
  formPagar.value          = { valor_pago: parseFloat(t.valor) - parseFloat(t.valor_pago ?? 0), tipo_pagamento_id: null, observacao: '' }
  modalPagarAberto.value   = true
  await tipoPagamentoStore.listar()
}

// ── Ações ─────────────────────────────────────────────────────────────────────
const registrarPagamento = async () => {
  pagando.value = true
  try {
    await transacaoStore.pagar(transacaoParaPagar.value.id, formPagar.value)
    $q.notify({ type: 'positive', message: 'Pagamento registrado com sucesso', position: 'top' })
    modalPagarAberto.value = false
    buscar()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao registrar pagamento', caption: e.response?.data?.error })
  } finally {
    pagando.value = false
  }
}

const confirmarCancelar = (t) => {
  $q.dialog({
    title:   'Cancelar transação',
    message: `Deseja cancelar a transação "<strong>${t.descricao}</strong>"?`,
    html:    true,
    cancel:  { label: 'Não', flat: true, color: 'grey-7' },
    ok:      { label: 'Cancelar', unelevated: true, color: 'orange-8', noCaps: true },
  }).onOk(async () => {
    try {
      await transacaoStore.cancelar(t.id)
      $q.notify({ type: 'positive', message: 'Transação cancelada', position: 'top' })
      buscar()
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Erro ao cancelar' })
    }
  })
}

const confirmarExcluir = (t) => {
  $q.dialog({
    title:   'Excluir transação',
    message: `Deseja excluir a transação "<strong>${t.descricao}</strong>"?`,
    html:    true,
    cancel:  { label: 'Cancelar', flat: true, color: 'grey-7' },
    ok:      { label: 'Excluir',  unelevated: true, color: 'negative', noCaps: true },
  }).onOk(async () => {
    try {
      await transacaoStore.excluir(t.id)
      $q.notify({ type: 'positive', message: 'Transação excluída', position: 'top' })
      buscar()
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Erro ao excluir' })
    }
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusCor = (s) => ({ PENDENTE: 'orange', PAGO: 'positive', CANCELADO: 'grey' }[s] ?? 'grey')
const statusLabel = (s) => ({ PENDENTE: 'Pendente', PAGO: 'Pago', CANCELADO: 'Cancelado' }[s] ?? s)

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)

const formatData = (d) => {
  if (!d) return '-'
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}

// ── Inicialização ─────────────────────────────────────────────────────────────
onMounted(async () => {
  await caixaStore.listar()
  buscar()
})
</script>
