<template>
  <q-page padding>
    <!-- Listagem de DOI -->
    <q-card bordered>
      <!-- Header da seção -->
      <q-card-section class="q-pa-none">
        <div class="section-header">
          <q-icon name="eva-home-outline" class="q-mr-sm" />
          <span class="section-title">DOI - Declaração de Operações Imobiliárias</span>
          <q-space />
          <div class="row q-gutter-sm items-center">
            <q-chip :label="`${declaracoes?.length || 0} declaração(ões)`" color="blue-grey-3" text-color="blue-grey-8"
              size="sm" />
            <q-btn icon="eva-download-outline" label="Gerar Lote" color="primary" @click="onGerarLote" size="sm"
              class="btn-custom" />

            <q-btn color="blue-9" icon="sync" label="Importar declarações da RFB" :loading="sincronizando" size="sm"
              class="btn-custom" outline @click="showModalImportacaoDoi = true" />

            <!-- <q-btn icon="eva-refresh-outline" label="Atualizar" color="grey-7" @click="onAtualizar" outline size="sm"
              class="btn-custom" :loading="loading" /> -->


            <q-btn icon="eva-refresh-outline" label="Relatório" color="grey-7" @click="showModalRelatorio" outline
              size="sm" :loading="loading" />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <!-- Tabela -->
    <q-card bordered>
      <q-card-section class="q-pa-none">
        <q-table flat square :rows="declaracoes" :columns="columns" :rows-per-page-options="[10, 20, 50, 0]"
          :loading="loading">
          <!-- Header customizado -->
          <template #header-cell="props">
            <q-th :props="props" class="table-header">
              {{ props.col.label }}
            </q-th>
          </template>

          <!-- Coluna ID com chip -->
          <template v-slot:body-cell-id="props">
            <q-td :props="props" class="text-center">
              <q-chip :label="props.row.id" color="blue-grey-3" text-color="blue-grey-8" size="sm" />
            </q-td>
          </template>

          <!-- Coluna Matrícula -->
          <template v-slot:body-cell-matricula="props">
            <q-td :props="props">
              <div class="text-weight-medium text-primary">
                {{ props.row.matricula || "-" }}
              </div>
            </q-td>
          </template>

          <!-- Coluna Número de Controle -->
          <template v-slot:body-cell-numero_controle="props">
            <q-td :props="props">
              <div class="text-weight-medium">
                {{ props.row.numero_controle || "-" }}
              </div>
            </q-td>
          </template>

          <!-- Coluna Status -->
          <template v-slot:body-cell-status_processamento="props">
            <q-td :props="props" class="text-center">
              <q-chip :label="getStatusLabel(props.row.status_processamento)"
                :color="getStatusColor(props.row.status_processamento)" text-color="white" size="sm"
                class="status-chip" />
            </q-td>
          </template>

          <!-- Coluna Lote -->
          <template v-slot:body-cell-lote_doi_id="props">
            <q-td :props="props" class="text-center">
              <q-chip v-if="props.row.lote_doi_id" :label="`Lote ${props.row.lote_doi_id}`" color="blue-6"
                text-color="white" size="sm" />
              <span v-else class="text-grey-5">-</span>
            </q-td>
          </template>

          <!-- Coluna Data do Ato -->
          <template v-slot:body-cell-data_ato="props">
            <q-td :props="props">
              <div class="text-grey-7">
                {{
                  props.row.data_ato
                    ? moment(props.row.data_ato).format("DD/MM/YYYY")
                    : "-"
                }}
              </div>
            </q-td>
          </template>

          <!-- Coluna Ações -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <div class="row q-gutter-xs justify-center">
                <q-btn icon="eva-edit-outline" dense round size="sm" @click="onEditar(props.row)" color="grey-7" flat
                  class="action-btn">
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>

                <q-btn icon="eva-printer-outline" dense round size="sm" @click="onImprimir(props.row)" color="grey-7"
                  flat class="action-btn" :loading="imprimindo === props.row.id">
                  <q-tooltip>Imprimir</q-tooltip>
                </q-btn>

                <q-btn icon="eva-trash-2-outline" dense round size="sm" @click="onExcluir(props.row)" color="grey-7"
                  flat class="action-btn">
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <!-- Estado vazio -->
          <template v-slot:no-data="{ message }">
            <div class="full-width row flex-center text-grey-6 q-gutter-sm q-py-xl">
              <q-icon size="3em" name="eva-home-outline" />
              <div class="text-center">
                <div class="text-h6 q-mb-sm">{{ message }}</div>
                <div class="text-caption">
                  Crie sua primeira declaração para começar
                </div>
              </div>
            </div>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing color="blue-grey-6" />
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <!-- Modal para Lote -->
  </q-page>
  <modal-lote-show v-model="showLoteModal" />
  <modal-importacao-receita-federal v-model="showModalImportacaoDoi" />
  <modal-relatorio v-model="modalRelatorio" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useDoiStore } from "src/stores/doi";
import { onMounted, ref } from "vue";
import moment from "moment";
import ModalLoteShow from "./lote/Index.vue";
import ModalImportacaoReceitaFederal from "./importarReceita.vue";
import ModalRelatorio from './relatorio/Index.vue';

defineOptions({
  name: "DoiIndex",
});

const $q = useQuasar();
const doiStore = useDoiStore();
const { declaracao, declaracoes } = storeToRefs(doiStore);

const loading = ref(false);
const imprimindo = ref(null);
const showLoteModal = ref(false);
const showModalImportacaoDoi = ref(false);

// Formulário do lote
const loteForm = ref({
  dataInicio: "",
  dataFim: "",
});

// Definição das colunas
const columns = ref([
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "center",
    style: "width: 80px;",
  },
  {
    name: "numero_controle",
    label: "Nº Controle",
    field: "numero_controle",
    align: "left",
    style: "min-width: 120px;",
  },
  {
    name: "matricula",
    label: "Matrícula",
    field: "matricula",
    align: "left",
    style: "min-width: 150px;",
  },
  {
    name: "status_processamento",
    label: "Status",
    field: "status_processamento",
    align: "center",
    style: "width: 120px;",
  },
  {
    name: "lote_doi_id",
    label: "Lote",
    field: "lote_doi_id",
    align: "center",
    style: "width: 100px;",
  },
  {
    name: "data_ato",
    label: "Data do Ato",
    align: "left",
    style: "width: 140px;",
  },
  {
    name: "actions",
    label: "Ações",
    align: "center",
    style: "width: 180px;",
  },
]);

// Funções auxiliares
const formatarData = (data) => {
  if (!data) return "-";
  return moment(data).format("DD/MM/YYYY");
};

const formatarHora = (data) => {
  if (!data) return "";
  return moment(data).format("HH:mm:ss");
};

const formatarValor = (valor) => {
  if (!valor) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

const getStatusLabel = (status) => {
  const statusMap = {
    pendente: "Pendente",
    em_processamento: "Processando",
    concluido: "Concluído",
    erro: "Erro",
    rejeitado: "Rejeitado",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status) => {
  const colorMap = {
    pendente: "orange-6",
    em_processamento: "blue-6",
    concluido: "green-6",
    erro: "red-6",
    rejeitado: "red-8",
  };
  return colorMap[status] || "grey-6";
};

// Funções de ação
const onGerarLote = () => {
  showLoteModal.value = !showLoteModal.value;
};

const onAtualizar = async () => {
  loading.value = true;
  try {
    await doiStore.index();
    $q.notify({
      color: "positive",
      message: "Lista atualizada com sucesso!",
      icon: "eva-checkmark-circle-outline",
      position: "top-right",
    });
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao atualizar a lista",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  } finally {
    loading.value = false;
  }
};

const onEditar = (row) => {
  $q.notify({
    color: "info",
    message: `Editando declaração: ${row.matricula || row.id}`,
    icon: "eva-edit-outline",
    position: "top-right",
  });
  // Implementar edição
};

const onImprimir = async (row) => {
  imprimindo.value = row.id;

  try {
    // Se a DOI já está em um lote, permitir download do lote
    if (row.lote_doi_id) {
      const response = await doiStore.downloadLote(row.lote_doi_id);

      $q.notify({
        color: "positive",
        message: "Download do lote iniciado!",
        icon: "eva-download-outline",
        position: "top-right",
      });
    } else {
      // Imprimir DOI individual
      await doiStore.imprimirDoi(row.id);

      $q.notify({
        color: "positive",
        message: "DOI enviada para impressão!",
        icon: "eva-printer-outline",
        position: "top-right",
      });
    }
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao processar solicitação",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  } finally {
    imprimindo.value = null;
  }
};

const modalRelatorio = ref(false);

const showModalRelatorio = async () => {
  modalRelatorio.value = !modalRelatorio.value;
}

const onExcluir = (row) => {
  // Não permitir exclusão se já está em lote
  if (row.lote_doi_id) {
    $q.notify({
      color: "warning",
      message: "Não é possível excluir DOI que já está em lote",
      icon: "eva-alert-triangle-outline",
      position: "top-right",
    });
    return;
  }

  $q.dialog({
    title: "Confirmar Exclusão",
    message: `Tem certeza que deseja excluir a DOI "${row.numero_controle || row.id
      }"?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(async () => {
    try {
      await doiStore.delete(row.id);
      await doiStore.index(); // Recarrega a lista

      $q.notify({
        color: "positive",
        message: "DOI excluída com sucesso!",
        icon: "eva-checkmark-circle-outline",
        position: "top-right",
      });
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "Erro ao excluir a DOI",
        icon: "eva-alert-circle-outline",
        position: "top-right",
      });
    }
  });
};

// Carregamento inicial
onMounted(async () => {
  loading.value = true;
  try {
    await doiStore.index();
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao carregar as declarações",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
// Headers das seções
.section-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;

  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #37474f;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .q-icon {
    color: #607d8b;
    font-size: 1.1rem;
  }
}

// Estilos customizados para tabelas
.custom-table {
  border: none;

  :deep(.q-table__top) {
    border-bottom: 1px solid #e0e0e0;
  }

  :deep(tbody tr) {
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f8f9fa;
    }
  }

  :deep(.q-table__bottom) {
    // background-color: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    color: #37474f;
  }
}

// Headers das tabelas
.table-header {
  color: #37474f;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e0e0e0;
}

// Botões customizados
.btn-custom {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.action-btn {
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

// Responsividade
@media (max-width: 768px) {
  .section-header {
    padding: 8px 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .section-title {
      font-size: 0.8rem;
    }

    .row {
      width: 100%;
      justify-content: space-between;
    }
  }

  .custom-table {

    :deep(.q-table__top),
    :deep(.q-table__bottom) {
      padding: 8px 12px;
    }
  }

  .table-header {
    font-size: 0.7rem;
    padding: 8px 12px;
  }

  .btn-custom {
    .q-btn__content {
      .q-icon+span {
        display: none;
      }
    }
  }
}
</style>