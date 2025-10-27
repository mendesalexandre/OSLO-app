<template>
  <modal v-model="showRelatorioModal" tamanho="lg" titulo="Relatório de Lotes - Central de Registro de Imóveis">
    <q-card class="full-width" bordered>
      <!-- Seção de Filtros -->
      <q-card-section>
        <div class="text-subtitle2 text-uppercase q-mb-md">
          Filtros de Pesquisa
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-label label="Data Início" />
            <q-input v-model="filtros.dataInicio" type="date" outlined dense clearable />
          </div>
          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-label label="Data Fim" />
            <q-input v-model="filtros.dataFim" type="date" outlined dense clearable />
          </div>
          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-label label="Número do Lote" />
            <q-input v-model="filtros.numeroLote" outlined dense placeholder="Ex: LOTE-2024-001" clearable />
          </div>
          <!-- <div class="col-md-3 col-sm-6 col-xs-12">
            <v-label label="Status" />
            <q-select v-model="filtros.status" :options="statusOptions" outlined dense clearable emit-value
              map-options />
          </div> -->
        </div>
        <div class="row q-mt-md">
          <div class="col-12">
            <q-btn label="Pesquisar" color="primary" icon="eva-search-outline" @click="onPesquisar"
              :loading="loadingPesquisa" class="q-mr-sm" />
            <q-btn label="Limpar Filtros" color="grey" outline icon="eva-refresh-outline" @click="onLimparFiltros" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Seção de Resultados -->

    </q-card>

    <q-card class="q-mt-sm" bordered>
      <q-card-section>
        <div class="text-subtitle2 text-uppercase">
          Lotes Encontrados ({{ lotes.length }})
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="no-padding">


        <q-table flat :rows="lotes" :columns="colunas" :loading="loadingPesquisa" row-key="id"
          :pagination="{ rowsPerPage: 10 }" no-data-label="Nenhum lote encontrado" loading-label="Carregando lotes..."
          rows-per-page-label="Lotes por página">
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip :color="getStatusColor(props.value)" text-color="white" dense
                :label="getStatusLabel(props.value)" />
            </q-td>
          </template>

          <template v-slot:body-cell-acoes="props">
            <q-td :props="props">
              <div class="q-gutter-xs">
                <!-- Marcar como Enviado -->
                <q-btn v-if="props.row.status !== 'enviado'" flat size="sm" color="green"
                  icon="eva-checkmark-circle-outline" dense round @click="onMarcarEnviado(props.row)"
                  :loading="props.row.id === loteEnviando">
                  <q-tooltip>Marcar como Enviado</q-tooltip>
                </q-btn>

                <!-- Gerar Relatório PDF -->
                <q-btn v-if="props.row.status === 'enviado'" flat size="sm" color="red" icon="eva-file-text-outline"
                  dense round @click="onGerarRelatorioPDF(props.row)" :loading="props.row.id === loteImprimindo">
                  <q-tooltip>Gerar Relatório PDF</q-tooltip>
                </q-btn>

                <!-- Visualizar Detalhes -->
                <q-btn size="sm" color="blue" flat icon="eva-eye-outline" dense round
                  @click="onVisualizarDetalhes(props.row)">
                  <q-tooltip>Visualizar Detalhes</q-tooltip>
                </q-btn>

                <!-- Excluir Lote -->
                <q-btn v-if="props.row.status !== 'enviado'" size="sm" color="red-8" flat icon="eva-trash-2-outline"
                  dense round @click="onExcluirLote(props.row)" :loading="props.row.id === loteExcluindo">
                  <q-tooltip>Excluir Lote</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <template #rodape>
      <q-card-section align="right" class="no-padding">
        <div class="q-gutter-sm">
          <q-btn label="Fechar" color="grey" v-close-popup outline />
          <q-btn v-if="lotesEnviados.length > 0" label="Relatório Geral PDF" color="red" icon="eva-download-outline"
            @click="onRelatorioGeralPDF" :loading="loadingRelatorioGeral" />
        </div>
      </q-card-section>
    </template>
  </modal>

  <!-- Modal de Detalhes do Lote -->
  <q-dialog v-model="showDetalhesModal" maximized>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Detalhes do Lote {{ loteDetalhes?.numero }}</div>
        <q-space />
        <q-btn icon="eva-close-outline" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="row q-gutter-md q-mb-lg">
          <div class="col-md-2 col-sm-4 col-xs-6">
            <strong>Número:</strong><br>
            {{ loteDetalhes?.numero }}
          </div>
          <div class="col-md-2 col-sm-4 col-xs-6">
            <strong>Data Criação:</strong><br>
            {{ formatarData(loteDetalhes?.data_criacao) }}
          </div>
          <div class="col-md-2 col-sm-4 col-xs-6">
            <strong>Status:</strong><br>
            <q-chip :color="getStatusColor(loteDetalhes?.status)" text-color="white" dense
              :label="getStatusLabel(loteDetalhes?.status)" />
          </div>
          <div class="col-md-2 col-sm-4 col-xs-6">
            <strong>Total DOIs:</strong><br>
            {{ loteDetalhes?.total_dois }}
          </div>
          <div class="col-md-2 col-sm-4 col-xs-6" v-if="loteDetalhes?.data_envio">
            <strong>Data Envio:</strong><br>
            {{ formatarData(loteDetalhes?.data_envio) }}
          </div>
        </div>

        <q-table :rows="loteDetalhes?.dois || []" :columns="colunasDois" row-key="id" :pagination="{ rowsPerPage: 15 }"
          title="DOIs do Lote" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDoiStore } from "src/stores/doi"; // Adapte conforme sua store
import { ref, computed, watch } from "vue";

const showRelatorioModal = defineModel({ default: false });
const doiStore = useDoiStore();

const $q = useQuasar();
const loadingPesquisa = ref(false);
const loadingRelatorioGeral = ref(false);
const loteEnviando = ref(null);
const loteImprimindo = ref(null);
const loteExcluindo = ref(null);
const showDetalhesModal = ref(false);
const loteDetalhes = ref(null);

// Dados
const lotes = ref([]);

// Filtros
const filtros = ref({
  dataInicio: "",
  dataFim: "",
  numeroLote: "",
  status: ""
});

// Opções de Status
const statusOptions = [
  { label: "Todos", value: "" },
  { label: "Pendente", value: "pendente" },
  { label: "Processando", value: "processando" },
  { label: "Enviado", value: "enviado" },
  { label: "Erro", value: "erro" }
];

// Computed
const lotesEnviados = computed(() =>
  lotes.value.filter(lote => lote.status === 'enviado')
);

// Colunas da tabela principal
const colunas = [
  {
    name: "numero",
    label: "Número do Lote",
    field: "id",
    align: "left",
    sortable: true
  },
  {
    name: "data_criacao",
    label: "Data Criação",
    field: "data_criacao",
    align: "center",
    sortable: true,
    format: (val) => formatarData(val)
  },
  {
    name: "total_dois",
    label: "Total DOIs",
    field: "total_dois",
    align: "center",
    sortable: true
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "center",
    sortable: true
  },
  {
    name: "data_envio",
    label: "Data Envio",
    field: "data_envio",
    align: "center",
    sortable: true,
    format: (val) => val ? formatarData(val) : "-"
  },
  {
    name: "acoes",
    label: "Ações",
    field: "",
    align: "center"
  }
];

// Colunas da tabela de DOIs
const colunasDois = [
  {
    name: "numero",
    label: "Número DOI",
    field: "numero",
    align: "left",
    sortable: true
  },
  {
    name: "tipo",
    label: "Tipo",
    field: "tipo",
    align: "center"
  },
  {
    name: "valor",
    label: "Valor",
    field: "valor",
    align: "right",
    format: (val) => `R$ ${val?.toFixed(2)}`
  },
  {
    name: "data_vencimento",
    label: "Vencimento",
    field: "data_vencimento",
    align: "center",
    format: (val) => formatarData(val)
  }
];

// Funções auxiliares
const formatarData = (data) => {
  if (!data) return "-";
  return new Date(data).toLocaleDateString("pt-BR");
};

const getStatusColor = (status) => {
  const cores = {
    pendente: "orange",
    processando: "blue",
    enviado: "green",
    erro: "red"
  };
  return cores[status] || "grey";
};

const getStatusLabel = (status) => {
  const labels = {
    pendente: "Pendente",
    processando: "Processando",
    enviado: "Enviado",
    erro: "Erro"
  };
  return labels[status] || "Desconhecido";
};

// Funções de ação
const onPesquisar = async () => {
  loadingPesquisa.value = true;
  try {
    const response = await doiStore.pesquisarLotes(filtros.value);
    lotes.value = response.data || [];
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao pesquisar lotes",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  } finally {
    loadingPesquisa.value = false;
  }
};

const onLimparFiltros = () => {
  filtros.value = {
    dataInicio: "",
    dataFim: "",
    numeroLote: "",
    status: ""
  };
  lotes.value = [];
};



const onExcluirLote = async (lote) => {
  // Primeiro verificar se o lote pode ser excluído
  try {
    const verificacao = await doiStore.verificarExclusaoLote(lote.id);

    if (!verificacao.pode_excluir) {
      $q.notify({
        color: "negative",
        message: verificacao.motivo,
        icon: "eva-alert-circle-outline",
        position: "top-right",
      });
      return;
    }
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao verificar se o lote pode ser excluído",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
    return;
  }

  // Confirmação de exclusão
  $q.dialog({
    title: "Confirmar Exclusão",
    message: `
      <div class="q-mb-md">
        <strong>Atenção!</strong> Esta ação irá:
      </div>
      <ul>
        <li>Excluir permanentemente o lote <strong>${lote.numero || `LOTE-${lote.id}`}</strong></li>
        <li>Liberar todas as ${lote.total_dois || lote.total_doi} declarações para nova geração de lote</li>
        <li>Esta ação <strong>não pode ser desfeita</strong></li>
      </ul>
      <div class="q-mt-md">
        Tem certeza que deseja continuar?
      </div>
    `,
    html: true,
    cancel: {
      label: "Cancelar",
      color: "grey",
      flat: true
    },
    ok: {
      label: "Sim, Excluir",
      color: "negative",
      icon: "eva-trash-2-outline"
    },
    persistent: true
  }).onOk(async () => {
    loteExcluindo.value = lote.id;
    try {
      const response = await doiStore.excluirLote(lote.id);

      // Remover o lote da lista local
      const index = lotes.value.findIndex(l => l.id === lote.id);
      if (index !== -1) {
        lotes.value.splice(index, 1);
      }

      $q.notify({
        color: "positive",
        message: response.message,
        caption: response.details,
        icon: "eva-checkmark-circle-outline",
        position: "top-right",
        timeout: 5000,
        actions: [
          {
            label: "OK",
            color: "white"
          }
        ]
      });

      // Recarregar a lista para garantir consistência
      await onPesquisar();

    } catch (error) {
      $q.notify({
        color: "negative",
        message: "Erro ao excluir lote",
        caption: error.response?.data?.error || "Erro desconhecido",
        icon: "eva-alert-circle-outline",
        position: "top-right",
      });
    } finally {
      loteExcluindo.value = null;
    }
  });
};

const onMarcarEnviado = async (lote) => {
  $q.dialog({
    title: "Confirmar Envio",
    message: `Deseja marcar o lote ${lote.numero} como enviado?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    loteEnviando.value = lote.id;
    try {
      await doiStore.marcarLoteEnviado(lote.id);

      // Atualizar o lote na lista
      const index = lotes.value.findIndex(l => l.id === lote.id);
      if (index !== -1) {
        lotes.value[index].status = 'enviado';
        lotes.value[index].data_envio = new Date().toISOString();
      }

      $q.notify({
        color: "positive",
        message: "Lote marcado como enviado com sucesso!",
        icon: "eva-checkmark-circle-outline",
        position: "top-right",
      });
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "Erro ao marcar lote como enviado",
        icon: "eva-alert-circle-outline",
        position: "top-right",
      });
    } finally {
      loteEnviando.value = null;
    }
  });
};

const onGerarRelatorioPDF = async (lote) => {
  loteImprimindo.value = lote.id;
  try {
    const response = await doiStore.gerarRelatorioPDF(lote.id);

    // Fazer download do PDF
    if (response.download_url) {
      window.open(response.download_url, "_blank");
    }

    $q.notify({
      color: "positive",
      message: "Relatório PDF gerado com sucesso!",
      icon: "eva-file-text-outline",
      position: "top-right",
    });
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao gerar relatório PDF",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  } finally {
    loteImprimindo.value = null;
  }
};

const onVisualizarDetalhes = async (lote) => {
  try {
    const response = await doiStore.obterDetalhesLote(lote.id);
    loteDetalhes.value = response.data;
    showDetalhesModal.value = true;
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao carregar detalhes do lote",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  }
};

const onRelatorioGeralPDF = async () => {
  const lotesIds = lotesEnviados.value.map(lote => lote.id);

  $q.dialog({
    title: "Relatório Geral",
    message: `Gerar relatório PDF com ${lotesIds.length} lotes enviados?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    loadingRelatorioGeral.value = true;
    try {
      const response = await doiStore.gerarRelatorioGeralPDF(lotesIds);

      if (response.download_url) {
        window.open(response.download_url, "_blank");
      }

      $q.notify({
        color: "positive",
        message: "Relatório geral gerado com sucesso!",
        icon: "eva-download-outline",
        position: "top-right",
      });
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "Erro ao gerar relatório geral",
        icon: "eva-alert-circle-outline",
        position: "top-right",
      });
    } finally {
      loadingRelatorioGeral.value = false;
    }
  });
};

// Carregar dados iniciais quando o modal for aberto
const carregarDadosIniciais = () => {
  if (showRelatorioModal.value) {
    onPesquisar();
  }
};

// Watch para detectar abertura do modal
watch(() => showRelatorioModal.value, carregarDadosIniciais);
</script>