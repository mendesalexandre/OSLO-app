<template>
  <q-page padding>

    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="oslo-page-title">Movimentos de Caixa</div>
        <div class="oslo-page-subtitle">Turnos e expedientes</div>
      </div>
      <div class="col-auto row q-gutter-sm">
        <q-btn
          v-permissao="'CAIXA_OPERACAO_SANGRIA'"
          flat no-caps color="orange-8"
          @click="abrirOperacao('SANGRIA')"
        >
          <l-icon name="arrow-down-circle" :size="16" class="q-mr-xs" />
          Sangria
        </q-btn>
        <q-btn
          v-permissao="'CAIXA_OPERACAO_REFORCO'"
          flat no-caps color="positive"
          @click="abrirOperacao('REFORCO')"
        >
          <l-icon name="arrow-up-circle" :size="16" class="q-mr-xs" />
          Reforço
        </q-btn>
        <q-btn
          v-permissao="'CAIXA_OPERACAO_TRANSFERIR'"
          flat no-caps color="primary"
          @click="abrirOperacao('TRANSFERENCIA')"
        >
          <l-icon name="arrow-left-right" :size="16" class="q-mr-xs" />
          Transferência
        </q-btn>
        <q-btn
          v-permissao="'CAIXA_MOVIMENTO_ABRIR'"
          unelevated color="primary" no-caps
          @click="modalAbrirAberto = true"
        >
          <l-icon name="unlock" :size="16" class="q-mr-sm" />
          Abrir Caixa
        </q-btn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="caixaMovimentoStore.loading" class="row justify-center q-my-xl">
      <q-spinner color="primary" size="50px" />
    </div>

    <!-- Cards -->
    <div v-else class="row q-col-gutter-md">

      <!-- Vazio -->
      <div v-if="caixaMovimentoStore.movimentos.length === 0" class="col-12">
        <q-card flat bordered>
          <q-card-section class="text-center q-pa-xl">
            <l-icon name="inbox" :size="64" class="text-grey-5" />
            <div class="text-h6 q-mt-md" style="color: var(--text-secondary)">Nenhum movimento encontrado</div>
            <div class="text-caption" style="color: var(--text-secondary)">Abra um caixa para iniciar o expediente</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Card por movimento -->
      <div
        v-for="m in caixaMovimentoStore.movimentos"
        :key="m.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="col">
                <div class="text-h6">{{ m.caixa?.nome }}</div>
                <div class="text-caption" style="color: var(--text-secondary)">
                  Aberto em {{ formatDateTime(m.data_abertura) }}
                </div>
              </div>
              <div class="col-auto">
                <q-chip :color="statusCor(m.status)" text-color="white" size="sm">
                  {{ statusLabel(m.status) }}
                </q-chip>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="q-gutter-xs text-body2">
              <div class="row justify-between">
                <span style="color: var(--text-secondary)">Saldo Inicial:</span>
                <span>{{ formatCurrency(m.saldo_inicial_informado) }}</span>
              </div>
              <div class="row justify-between">
                <span style="color: var(--text-secondary)">Entradas:</span>
                <span class="text-positive">{{ formatCurrency(m.total_entradas) }}</span>
              </div>
              <div class="row justify-between">
                <span style="color: var(--text-secondary)">Saídas:</span>
                <span class="text-negative">{{ formatCurrency(m.total_saidas) }}</span>
              </div>
              <q-separator class="q-my-xs" />
              <div class="row justify-between text-weight-bold">
                <span>Saldo Calculado:</span>
                <span class="text-positive">{{ formatCurrency(saldoCalculado(m)) }}</span>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="text-caption" style="color: var(--text-secondary)">
              <l-icon name="user" :size="12" class="q-mr-xs" />
              {{ m.usuario_abertura?.nome ?? m.usuario_abertura?.name }}
            </div>

            <div v-if="m.data_fechamento" class="text-caption q-mt-xs" style="color: var(--text-secondary)">
              <l-icon name="calendar" :size="12" class="q-mr-xs" />
              Fechado em {{ formatDateTime(m.data_fechamento) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <template v-if="m.status === 'ABERTO'">
              <q-btn
                v-permissao="'CAIXA_MOVIMENTO_FECHAR'"
                flat dense no-caps color="negative"
                @click="abrirFechar(m)"
              >
                <l-icon name="lock" :size="16" class="q-mr-xs" />
                Fechar
              </q-btn>
            </template>
            <template v-if="m.status === 'FECHADO'">
              <q-btn
                v-permissao="'CAIXA_MOVIMENTO_CONFERIR'"
                flat dense no-caps color="positive"
                @click="confirmarConferir(m)"
              >
                <l-icon name="check-circle" :size="16" class="q-mr-xs" />
                Conferir
              </q-btn>
              <q-btn
                v-permissao="'CAIXA_MOVIMENTO_REABRIR'"
                flat dense no-caps color="orange-8"
                @click="confirmarReabrir(m)"
              >
                <l-icon name="refresh-cw" :size="16" class="q-mr-xs" />
                Reabrir
              </q-btn>
            </template>
          </q-card-actions>
        </q-card>
      </div>

    </div>

    <!-- Modais -->
    <ModalAbrirMovimento
      v-model="modalAbrirAberto"
      @aberto="caixaMovimentoStore.listar()"
    />

    <ModalFecharMovimento
      v-model="modalFecharAberto"
      :movimento="movimentoSelecionado"
      @fechado="caixaMovimentoStore.listar()"
    />

    <ModalOperacao
      v-model="modalOperacaoAberto"
      :tipo="operacaoTipo"
      @salvo="caixaMovimentoStore.listar()"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useCaixaMovimentoStore } from 'src/stores/caixaMovimento'
import ModalAbrirMovimento from 'src/components/caixa/ModalAbrirMovimento.vue'
import ModalFecharMovimento from 'src/components/caixa/ModalFecharMovimento.vue'
import ModalOperacao from 'src/components/caixa/ModalOperacao.vue'

defineOptions({ name: 'MovimentoCaixaIndex' })

const $q                  = useQuasar()
const caixaMovimentoStore = useCaixaMovimentoStore()

// ── Estado ────────────────────────────────────────────────────────────────────
const modalAbrirAberto    = ref(false)
const modalFecharAberto   = ref(false)
const modalOperacaoAberto = ref(false)
const movimentoSelecionado = ref(null)
const operacaoTipo        = ref(null)

// ── Ações ─────────────────────────────────────────────────────────────────────
const abrirFechar = (movimento) => {
  movimentoSelecionado.value = movimento
  modalFecharAberto.value    = true
}

const abrirOperacao = (tipo) => {
  operacaoTipo.value        = tipo
  modalOperacaoAberto.value = true
}

const confirmarConferir = (movimento) => {
  $q.dialog({
    title:   'Conferir Movimento',
    message: `Confirma a conferência do caixa <strong>${movimento.caixa?.nome}</strong>?`,
    html:    true,
    cancel:  { label: 'Cancelar', flat: true, color: 'grey-7' },
    ok:      { label: 'Conferir', unelevated: true, color: 'positive', noCaps: true },
  }).onOk(async () => {
    try {
      await caixaMovimentoStore.conferir(movimento.id)
      $q.notify({ type: 'positive', message: 'Movimento conferido com sucesso', position: 'top' })
      caixaMovimentoStore.listar()
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Erro ao conferir', caption: e.response?.data?.error })
    }
  })
}

const confirmarReabrir = (movimento) => {
  $q.dialog({
    title:   'Reabrir Caixa',
    message: 'Informe o motivo da reabertura:',
    prompt:  { model: '', label: 'Motivo', type: 'text' },
    cancel:  { label: 'Cancelar', flat: true, color: 'grey-7' },
    ok:      { label: 'Reabrir',  unelevated: true, color: 'orange-8', noCaps: true },
  }).onOk(async (motivo) => {
    try {
      await caixaMovimentoStore.reabrir(movimento.id, motivo)
      $q.notify({ type: 'positive', message: 'Caixa reaberto com sucesso', position: 'top' })
      caixaMovimentoStore.listar()
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Erro ao reabrir', caption: e.response?.data?.error })
    }
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusCor = (status) => ({
  ABERTO:    'positive',
  FECHADO:   'grey-7',
  CONFERIDO: 'primary',
  CANCELADO: 'negative',
}[status] ?? 'grey')

const statusLabel = (status) => ({
  ABERTO:    'Aberto',
  FECHADO:   'Fechado',
  CONFERIDO: 'Conferido',
  CANCELADO: 'Cancelado',
}[status] ?? status)

const saldoCalculado = (m) => {
  const ini = parseFloat(m.saldo_inicial_informado ?? 0)
  const ent = parseFloat(m.total_entradas ?? 0)
  const sai = parseFloat(m.total_saidas ?? 0)
  return ini + ent - sai
}

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)

const formatDateTime = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleString('pt-BR')
}

// ── Inicialização ─────────────────────────────────────────────────────────────
onMounted(() => caixaMovimentoStore.listar())
</script>
