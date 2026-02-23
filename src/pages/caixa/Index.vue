<template>
  <q-page padding>

    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="oslo-page-title">Caixas</div>
        <div class="oslo-page-subtitle">Cadastro de caixas disponíveis</div>
      </div>
      <div class="col-auto">
        <q-btn
          v-permissao="'CAIXA_CRIAR'"
          unelevated color="primary" no-caps
          @click="abrirModalCriar"
        >
          <l-icon name="plus" :size="16" class="q-mr-sm" />
          Novo Caixa
        </q-btn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="caixaStore.loading" class="row justify-center q-my-xl">
      <q-spinner color="primary" size="50px" />
    </div>

    <!-- Cards -->
    <div v-else class="row q-col-gutter-md">

      <!-- Vazio -->
      <div v-if="caixaStore.caixas.length === 0" class="col-12">
        <q-card flat bordered>
          <q-card-section class="text-center q-pa-xl">
            <l-icon name="wallet" :size="64" class="text-grey-5" />
            <div class="text-h6 q-mt-md" style="color: var(--text-secondary)">Nenhum caixa cadastrado</div>
            <div class="text-caption" style="color: var(--text-secondary)">Clique em "Novo Caixa" para começar</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Card por caixa -->
      <div
        v-for="c in caixaStore.caixas"
        :key="c.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="col">
                <div class="text-h6">{{ c.nome }}</div>
                <div class="text-caption" style="color: var(--text-secondary)">{{ c.descricao }}</div>
              </div>
              <div class="col-auto">
                <q-chip
                  :color="c.is_ativo ? 'positive' : 'grey'"
                  text-color="white"
                  size="sm"
                >
                  {{ c.is_ativo ? 'Ativo' : 'Inativo' }}
                </q-chip>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="q-gutter-sm">
              <div class="row justify-between">
                <span style="color: var(--text-secondary)">Saldo Atual:</span>
                <span class="text-h6 text-positive">{{ formatCurrency(c.saldo_atual) }}</span>
              </div>
              <div class="row justify-between text-caption">
                <span style="color: var(--text-secondary)">Requer Abertura:</span>
                <span>{{ c.requer_abertura ? 'Sim' : 'Não' }}</span>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              flat dense color="primary" no-caps
              :disable="!c.is_ativo"
              @click="abrirCaixa(c)"
            >
              <l-icon name="external-link" :size="16" class="q-mr-xs" />
              Abrir
            </q-btn>
            <q-btn
              v-permissao="'CAIXA_EDITAR'"
              flat dense round color="grey-7" size="sm"
              @click="abrirModalEditar(c)"
            >
              <l-icon name="pen" :size="16" />
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              v-permissao="'CAIXA_EXCLUIR'"
              flat dense round color="negative" size="sm"
              @click="confirmarExcluir(c)"
            >
              <l-icon name="trash-2" :size="16" />
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>

    </div>

    <!-- Modal Criar/Editar -->
    <ModalCaixa
      v-model="modalAberto"
      :caixa="caixaSelecionado"
      @salvo="caixaStore.listar()"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useCaixaStore } from 'src/stores/caixa'
import ModalCaixa from 'src/components/caixa/ModalCaixa.vue'

defineOptions({ name: 'CaixaIndex' })

const $q         = useQuasar()
const router     = useRouter()
const caixaStore = useCaixaStore()

// ── Estado ────────────────────────────────────────────────────────────────────
const modalAberto    = ref(false)
const caixaSelecionado = ref(null)

// ── Modais ────────────────────────────────────────────────────────────────────
const abrirModalCriar = () => {
  caixaSelecionado.value = null
  modalAberto.value      = true
}

const abrirModalEditar = (caixa) => {
  caixaSelecionado.value = caixa
  modalAberto.value      = true
}

// ── Ações ─────────────────────────────────────────────────────────────────────
const abrirCaixa = (caixa) => {
  router.push({ name: 'movimento-caixa' })
}

const confirmarExcluir = (caixa) => {
  $q.dialog({
    title:   'Excluir caixa',
    message: `Deseja excluir o caixa "<strong>${caixa.nome}</strong>"?`,
    html:    true,
    cancel:  { label: 'Cancelar', flat: true, color: 'grey-7' },
    ok:      { label: 'Excluir',  unelevated: true, color: 'negative', noCaps: true },
  }).onOk(async () => {
    try {
      await caixaStore.excluir(caixa.id)
      $q.notify({ type: 'positive', message: 'Caixa excluído com sucesso', position: 'top' })
      caixaStore.listar()
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir caixa',
        caption: e.response?.data?.mensagem ?? e.response?.data?.message,
      })
    }
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)

// ── Inicialização ─────────────────────────────────────────────────────────────
onMounted(() => caixaStore.listar())
</script>
