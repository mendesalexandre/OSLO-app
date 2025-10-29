<template>
  <modal v-model="showLoteModal" tamanho="md" titulo="Gerar Lote de Declarações" @close="onCancelar">
    <q-card class="full-width" bordered>
      <q-card-section>
        <div class="text-subtitle2 text-uppercase">
          Selecione o período para incluir as DOIs no lote
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-gutter-md">
          <div class="col">
            <v-label label="Data Início" />
            <q-input v-model="loteForm.dataInicio" type="date" outlined dense
              :rules="[(val) => !!val || 'Campo obrigatório']" />
          </div>
          <div class="col">
            <v-label label="Data Fim" />
            <q-input v-model="loteForm.dataFim" type="date" outlined dense :rules="[
              (val) => !!val || 'Campo obrigatório',
              (val) =>
                val >= loteForm.dataInicio ||
                'Data fim deve ser maior que data início',
            ]" />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <template #rodape>
      <q-card-section align="right">
        <div class="q-gutter-sm">
          <q-btn label="Cancelar" color="grey" v-close-popup outline />
          <q-btn outline label="Preview" color="primary" @click="onPreviewLoteClick" :loading="loading"
            :disable="!loteForm.dataInicio || !loteForm.dataFim" />
        </div>
      </q-card-section>
    </template>
  </modal>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDoiStore } from "src/stores/doi";
import { ref } from "vue";

const showLoteModal = defineModel({ default: false });
const doiStore = useDoiStore();

const $q = useQuasar();
const loading = ref(false);
const imprimindo = ref(null);

// Formulário do lote
const loteForm = ref({
  dataInicio: "",
  dataFim: "",
});
// Funções de ação

const onPreviewLoteClick = async () => {
  await onPreviewLote(loteForm.value.dataInicio, loteForm.value.dataFim);
  // showLoteModal.value = false;
};

const onPreviewLote = async (dataInicio, dataFim) => {
  loading.value = true;
  try {
    const response = await doiStore.previewLote(dataInicio, dataFim);

    $q.dialog({
      title: "Preview do Lote",
      message: `
        <div class="q-mb-md">
          <strong>Período:</strong> ${response.periodo}<br>
          <strong>DOIs válidas:</strong> ${response.total_validas}<br>
          <strong>DOIs com problemas:</strong> ${response.total_problemas}
        </div>
        ${response.total_validas > 0
          ? "Deseja gerar o lote?"
          : "Não há DOIs válidas no período."
        }
      `,
      html: true,
      cancel: response.total_validas > 0,
      persistent: true,
      ok:
        response.total_validas > 0
          ? {
            label: "Gerar Lote",
            color: "primary",
          }
          : {
            label: "OK",
            color: "grey",
          },
    }).onOk(async () => {
      if (response.total_validas > 0) {
        await onCriarLote(dataInicio, dataFim);
      }
    });
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao fazer preview do lote",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  } finally {
    loading.value = false;
  }
};

const onCriarLote = async (dataInicio, dataFim) => {
  loading.value = true;
  try {
    const response = await doiStore.criarLote(dataInicio, dataFim);

    $q.notify({
      color: "positive",
      message: `Lote criado com sucesso! ${response.total_dois} Declarações incluídas.`,
      icon: "eva-checkmark-circle-outline",
      position: "top-right",
      timeout: 10000,
      actions: [
        {
          label: "Download",
          color: "white",
          handler: () => {
            window.open(response.download_url, "_blank");
          },
        },
      ],
    });

    // Recarregar lista
    await onAtualizar();
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao criar lote",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  } finally {
    loading.value = false;
  }
};

const onCancelar = () => {
  showLoteModal.value = !showLoteModal.value;
};
</script>