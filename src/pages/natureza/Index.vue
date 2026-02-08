<template>
  <q-page padding>
    <!-- Header -->
    <div class="oslo-page-header">
      <div>
        <h1 class="oslo-page-title">Naturezas de Documentos</h1>
        <p class="oslo-page-subtitle">Cadastre os serviços conforme necessário</p>
      </div>
      <q-btn
        label="Adicionar"
        color="primary"
        icon="add"
        unelevated
        no-caps
        @click="abrirModal"
        v-permissao="'NATUREZA_CRIAR'"
      />
    </div>

    <!-- Tabela -->
    <q-table
      :rows="naturezas"
      :columns="colunas"
      class="q-mt-md"
      flat
      bordered
      row-key="id"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>

          <q-td key="is_ativo" :props="props">
            <q-icon
              size="xs"
              :name="props.row.is_ativo ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
              :color="props.row.is_ativo ? 'positive' : 'negative'"
            />
          </q-td>

          <q-td key="nome" :props="props">
            {{ props.row?.nome }}
          </q-td>

          <q-td key="data_cadastro" :props="props">
            {{ dataHora(props.row?.data_cadastro) }}
          </q-td>

          <q-td key="data_alteracao" :props="props">
            {{ dataHora(props.row?.data_alteracao) }}
          </q-td>

          <q-td key="acao" :props="props">
            <q-btn
              flat
              round
              dense
              icon="edit"
              size="sm"
              color="grey-7"
              @click="abrirModal(props.row)"
              v-permissao="'NATUREZA_EDITAR'"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete"
              size="sm"
              color="negative"
              @click="onDelete(props.row)"
              v-permissao="'NATUREZA_EXCLUIR'"
            >
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <modal-natureza-show v-model="modalNaturezaShow" />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import ModalNaturezaShow from "./Show.vue";
import { useNaturezaStore } from "src/stores/natureza";
import { storeToRefs } from "pinia";
import { dataHora } from "src/Utils/DataHora";

defineOptions({ name: "NaturezaIndex" });

const $q = useQuasar();
const modalNaturezaShow = ref(false);

const colunas = ref([
  { name: "id", label: "ID", field: "id", align: "left" },
  { name: "is_ativo", label: "Ativo", field: (row) => (row.is_ativo ? "Sim" : "Não"), align: "left" },
  { name: "nome", label: "Nome", field: "nome", align: "left" },
  { name: "data_cadastro", label: "Data de Cadastro", align: "left" },
  { name: "data_alteracao", label: "Data de Alteração", field: "data_alteracao", align: "left" },
  { name: "acao", label: "", align: "right" },
]);

async function abrirModal(row) {
  if (row?.id) {
    await naturezaStore.show(row.id);
  }
  modalNaturezaShow.value = !modalNaturezaShow.value;
}

const naturezaStore = useNaturezaStore();
const { naturezas } = storeToRefs(naturezaStore);

const onDelete = (row) => {
  $q.dialog({
    title: "Confirmar Exclusão",
    message: `Deseja excluir a natureza "${row.nome}"?`,
    cancel: { label: "Cancelar", flat: true, color: "grey-7" },
    ok: { label: "Excluir", color: "negative", unelevated: true },
    persistent: true,
  });
};

onMounted(async () => {
  try {
    $q.loading.show();
    await naturezaStore.index();
  } catch (e) {
    $q.notify({
      color: "negative",
      message: "Erro ao buscar naturezas",
      position: "top",
    });
  } finally {
    $q.loading.hide();
  }
});
</script>

<style lang="scss" scoped>
.oslo-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.oslo-page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.oslo-page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}
</style>
