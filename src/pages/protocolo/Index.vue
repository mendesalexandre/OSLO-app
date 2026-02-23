<template>
  <q-page :style-fn="pageTweak">
    <q-header class=" bg-white text-dark">
      <q-toolbar>

        <div class="text-uppercase text-h6 text-dark text-weight-bold q-ml-md">
          {{ titulo }}
        </div>

        <q-space />

        <q-tabs :model-value="rotaAtiva" mobile-arrows align="left" no-caps active-color="white"
          indicator-color="transparent" class="oslo-tabs-pill">
          <q-route-tab :to="{ name: 'protocolo.geral', params: { uuid: $route.params.uuid } }" name="geral"
            label="Informações Gerais" class="oslo-tab-pill" />
          <q-route-tab :to="{ name: 'protocolo.atos', params: { uuid: $route.params.uuid } }" name="atos"
            class="oslo-tab-pill">
            <div class="oslo-tab-pill__content">
              <span>Atos & Registros</span>
              <q-badge v-if="totalAtos > 0" :label="totalAtos" color="orange-3" text-color="orange-9" class="q-ml-xs" />
            </div>
          </q-route-tab>
          <q-route-tab :to="{ name: 'protocolo.financeiro', params: { uuid: $route.params.uuid } }" name="financeiro"
            class="oslo-tab-pill">
            <div class="oslo-tab-pill__content">
              <span>Financeiro</span>
              <q-badge v-if="valorRestante > 0" label="!" color="red-3" text-color="red-9" class="q-ml-xs" />
            </div>
          </q-route-tab>
          <q-route-tab :to="{ name: 'protocolo.anotacoes', params: { uuid: $route.params.uuid } }" name="anotacoes"
            label="Anotações" class="oslo-tab-pill" />
        </q-tabs>

        <q-space />

        <div class="q-gutter-sm flex justify-center items-center">
          <!-- <q-btn v-if="protocolo && valorRestante > 0" flat dense icon="eva-credit-card-outline" label="Receber"
            color="green-6" no-caps @click="receberPagamento">
            <q-tooltip>Receber Pagamento</q-tooltip>
          </q-btn> -->
          <q-btn v-if="protocolo && protocolo.status !== 'cancelado'" flat dense icon="print" label="Imprimir"
            color="grey-7" no-caps @click="imprimirProtocolo" />
          <q-btn v-if="protocolo && (protocolo.status === 'aberto' || protocolo.status === 'pago_parcial')" flat dense
            icon="cancel" label="Cancelar" color="negative" no-caps @click="confirmarCancelamento" />
        </div>
      </q-toolbar>

      <!-- Linha de Informações -->
      <q-toolbar v-if="protocolo" class="bg-grey-2">
        <q-chip :color="getStatusColor(protocolo.status)" text-color="white" size="sm">
          {{ getStatusLabel(protocolo.status) }}
        </q-chip>
        <span class="text-caption text-grey-7 q-mx-sm">
          <strong>Solicitante:</strong> {{ protocolo.solicitante_nome }}
        </span>
        <span class="text-caption text-grey-7 q-mx-sm">
          <strong>CPF/CNPJ:</strong> {{ protocolo.solicitante_cpf_cnpj || '-' }}
        </span>
        <span class="text-caption text-grey-7 q-mx-sm">
          <strong>Data:</strong> {{ formatarData(protocolo.data_cadastro) }}
        </span>
        <span v-if="protocolo.matricula" class="text-caption text-grey-7 q-mx-sm">
          <strong>Matrícula:</strong> {{ protocolo.matricula }}
        </span>
      </q-toolbar>
    </q-header>

    <!-- Conteúdo com Sidebar -->
    <div class="protocolo-layout">
      <!-- Conteúdo Principal -->
      <div class="protocolo-content">
        <router-view v-if="protocolo" :protocolo="protocolo" @atualizar="carregarProtocolo" />
      </div>

      <!-- Sidebar Direita -->
      <protocolo-sidebar v-if="protocolo" :protocolo="protocolo" class="protocolo-sidebar-container" />
    </div>

    <!-- Footer Financeiro -->
    <q-footer class=" bg-white text-dark">
      <div class="q-pa-md">
        <div class="row items-center justify-between">
          <!-- Resumo financeiro -->
          <div class="col">
            <div class="row items-center q-gutter-md">
              <div class="summary-item">
                <span class="text-caption text-grey-6">Total:</span>
                <span class="text-weight-bold text-grey-8 q-ml-xs">
                  {{ formatarDinheiroBrasil(totalEmolumentoGeral) }}
                </span>
              </div>

              <div v-if="valorDesconto > 0" class="summary-item">
                <span class="text-caption text-grey-6">Desconto:</span>
                <span class="text-weight-medium text-red-6 q-ml-xs">
                  -{{ formatarDinheiroBrasil(valorDesconto) }}
                </span>
              </div>

              <div v-if="valorPago > 0" class="summary-item">
                <span class="text-caption text-grey-6">Pago:</span>
                <span class="text-weight-medium text-green-6 q-ml-xs">
                  {{ formatarDinheiroBrasil(valorPago) }}
                </span>
              </div>

              <div class="summary-item">
                <span class="text-caption text-grey-6">Restante:</span>
                <span class="text-weight-bold text-primary q-ml-xs">
                  {{ formatarDinheiroBrasil(valorRestante) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="col-auto">
            <q-chip v-if="valorRestante > 0" label="Pendente" color="orange-3" text-color="orange-8" size="sm"
              outline />
            <q-chip v-else label="Quitado" color="green-3" text-color="green-8" size="sm" outline />
          </div>
        </div>
      </div>
    </q-footer>

    <!-- Loading -->
    <q-inner-loading :showing="carregando && !protocolo">
      <q-spinner-dots color="primary" size="50px" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useProtocoloStore } from "src/stores/protocolo";
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { formatarDinheiroBrasil, formatarData } from "src/Utils";
import ProtocoloSidebar from "src/components/protocolo/ProtocoloSidebar.vue";
import { usePageScroll } from 'src/composables/usePageScroll';

defineOptions({
  name: "ProtocoloIndex",
});

const protocoloStore = useProtocoloStore();
const { protocolo, carregando } = storeToRefs(protocoloStore);
const { pageTweak } = usePageScroll();
const $route = useRoute();
const $router = useRouter();
const $q = useQuasar();
// Computed para rota ativa
const rotaAtiva = computed(() => {
  if ($route.name === 'protocolo.geral') return 'geral'
  if ($route.name === 'protocolo.atos') return 'atos'
  if ($route.name === 'protocolo.financeiro') return 'financeiro'
  return 'geral'
})

// Valores financeiros do protocolo
const totalEmolumentoGeral = computed(() => protocolo.value?.valor_total || 0);
const valorDesconto = computed(() => protocolo.value?.valor_desconto || 0);
const valorPago = computed(() => protocolo.value?.valor_pago || 0);
const valorRestante = computed(() => {
  return (protocolo.value?.valor_final || 0) - (protocolo.value?.valor_pago || 0);
});

// Computed para as badges das tabs
const totalAtos = computed(() => {
  return protocolo.value?.itens?.length || 0;
});

const titulo = computed(() => {
  if (!protocolo.value?.numero) return "Novo Protocolo";
  // Converte de "2026/000001" para "000001/2026"
  const partes = protocolo.value.numero.split('/');
  if (partes.length === 2) {
    return `Protocolo RI ${partes[1]}/${partes[0]}`;
  }
  return `Protocolo RI ${protocolo.value.numero}`;
});

// Métodos de ação
const receberPagamento = () => {
  $router.push({ name: 'protocolo.financeiro', params: { uuid: $route.params.uuid } });
  $q.notify({
    color: "positive",
    message: "Navegando para financeiro",
    icon: "eva-credit-card-outline",
    position: "top-right",
  });
};

const imprimirProtocolo = () => {
  window.print();
};

const confirmarCancelamento = () => {
  $q.dialog({
    title: 'Confirmar Cancelamento',
    message: 'Deseja cancelar este protocolo? Esta ação não pode ser desfeita.',
    prompt: {
      model: '',
      type: 'text',
      label: 'Motivo do cancelamento *',
      isValid: (val) => val && val.length > 3,
    },
    cancel: true,
    persistent: true,
  }).onOk(async (motivo) => {
    await excluirProtocolo(motivo);
  });
};

const excluirProtocolo = async (motivo) => {
  try {
    await protocoloStore.cancelar(protocolo.value.id, motivo);
    $q.notify({
      color: "positive",
      message: "Protocolo cancelado com sucesso",
      icon: "eva-trash-2-outline",
      position: "top-right",
    });
    $router.push({ name: "protocolo.lista" });
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao cancelar protocolo",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  }
};

function voltar() {
  $router.push({ name: 'protocolo.lista' })
}

function getStatusColor(status) {
  const cores = {
    aberto: 'blue',
    pago: 'green',
    pago_parcial: 'orange',
    isento: 'grey',
    cancelado: 'red',
  }
  return cores[status] || 'grey'
}

function getStatusLabel(status) {
  const labels = {
    aberto: 'Aberto',
    pago: 'Pago',
    pago_parcial: 'Pago Parcial',
    isento: 'Isento',
    cancelado: 'Cancelado',
  }
  return labels[status] || status
}

// Carregar protocolo
async function carregarProtocolo() {
  try {
    await protocoloStore.carregar($route.params.uuid);
  } catch (error) {
    console.error("Erro ao carregar protocolo:", error);
    $q.notify({
      color: "negative",
      message: "Não foi possível carregar o protocolo.",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
    $router.push({ name: "protocolo.lista" });
  }
}

onMounted(() => {
  carregarProtocolo();
});

watch(() => $route.params.uuid, (newUuid) => {
  if (newUuid) {
    carregarProtocolo();
  }
});
</script>

<style lang="scss" scoped>
.protocolo-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.protocolo-header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #E8EAED;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.protocolo-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.protocolo-content {
  flex: 1;
  padding: 24px;
  background: #F8F9FA;
  overflow-y: auto;
}

.protocolo-sidebar-container {
  width: 320px;
  flex-shrink: 0;
  overflow-y: auto;
}

.protocolo-footer {
  position: sticky;
  bottom: 0;
  z-index: 100;
  border-top: 1px solid #E8EAED;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
}

.summary-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

// Tabs estilo pill
:deep(.oslo-tabs-pill) {
  .q-tabs__content {
    gap: 8px;
  }

  // Remover indicador underline
  .q-tab__indicator {
    display: none !important;
  }
}

:deep(.oslo-tab-pill) {
  border-radius: 20px !important;
  border: 1px solid #E8EAED !important;
  background: transparent !important;
  color: #5F6368 !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 6px 16px !important;
  min-height: 36px !important;
  text-transform: none !important;
  transition: all 0.15s ease !important;

  .q-tab__content {
    min-width: auto;
    padding: 0;
  }

  .q-tab__label {
    color: #5F6368 !important;
    font-size: 13px !important;
    font-weight: 500 !important;
  }

  // Hover (inativa)
  &:hover:not(.q-tab--active) {
    background: #F5F5F5 !important;
    border-color: #D1D5DB !important;
  }

  // ATIVA
  &.q-tab--active {
    background: #FF7A00 !important;
    border-color: #FF7A00 !important;
    color: #FFFFFF !important;

    .q-tab__label,
    .oslo-tab-pill__content,
    .oslo-tab-pill__content span {
      color: #FFFFFF !important;
    }

    // Badge na tab ativa
    .q-badge {
      background: rgba(255, 255, 255, 0.25) !important;
      color: #FFFFFF !important;
    }
  }
}

.oslo-tab-pill__content {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .protocolo-content {
    padding: 16px;
  }

  .summary-item {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .protocolo-footer .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>