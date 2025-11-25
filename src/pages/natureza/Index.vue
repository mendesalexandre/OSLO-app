<template>
  <q-page padding>
    <div class="flex justify-between q-mb-sm">
      <div>
        <h1 class="text-slate-900">
          Naturezas de Documentos
        </h1>
        <p class="text-slate-500 mt-1">
          Cadastre os serviços conforme necessário
        </p>
      </div>
      <q-btn label="Adicionar" color="primary" icon="add" class="shadcn-btn" outline @click="abrirModal">
        <q-tooltip> Novo Modelo de Texto </q-tooltip>
      </q-btn>
    </div>

    <q-table :rows="naturezas" :columns="colunas" class="q-mt-sm" bordered>
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- <q-td key="data_solicitacao" :props="props" class="text-left">
            {{ formatarDataHoraBrasil(props.row.data_solicitacao) }}
          </q-td> -->

          <q-td key="id" :props="props" class="text-left">
            {{ props.row.id }}
          </q-td>

          <q-td key="is_ativo" :props="props">
            <q-icon size="xs" :name="props.row.is_ativo
              ? 'fa-solid fa-circle-check'
              : 'fa-solid fa-circle-xmark'
              " :color="props.row.is_ativo ? 'green-10' : 'negative'"></q-icon>
          </q-td>

          <q-td key="nome" :props="props">
            {{ props.row?.nome }}
          </q-td>

          <q-td key="data_cadastro" :props="props">
            {{ dataHora(props.row?.data_cadastro) }}
          </q-td>
          <q-td key="data_cadastro" :props="props">
            {{ dataHora(props.row?.data_alteracao) }}
          </q-td>

          <q-td key="acao" :props="props" class="text-left">
            <q-btn outline flat round icon="fa-duotone fa-pen-to-square" size="sm" @click="abrirModal(props.row)"
              color="dark" title="Cancelar transação"></q-btn>
            <q-btn round flat icon="fa-regular fa-trash-can" size="sm" @click="onDelete(props.row)" color="negative"
              outline></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
  <modal-natureza-show v-model="modalNaturezaShow" />
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import ModalNaturezaShow from "./Show.vue";
import { useNaturezaStore } from "src/stores/natureza";
import { storeToRefs } from "pinia";
import { dataHora } from "src/Utils/DataHora";

defineOptions({
  name: "NaturezaIndex",
});

const $q = useQuasar();
const modalNaturezaShow = ref(false);

const colunas = ref([
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
  },
  {
    name: "is_ativo",
    label: "Ativo?",
    field: (row) => (row.is_ativo ? "Sim" : "Não"),
    align: "left",
  },
  {
    name: "nome",
    label: "Nome",
    field: "nome",
    align: "left",
  },

  {
    name: "data_cadastro",
    label: "Data de Cadastro",
    align: "left",
  },

  {
    name: "data_alteracao",
    label: "Data de Alteração",
    field: "data_alteracao",
    align: "left",
    format: (val) => moment(val).format("DD/MM/YYYY HH:mm:ss"),
  },
  { name: "acao", label: "" },
]);

async function abrirModal(row) {
  await naturezaStore.show(row.id);
  modalNaturezaShow.value = !modalNaturezaShow.value;
}

const naturezaStore = useNaturezaStore();
const { naturezas } = storeToRefs(naturezaStore);

// const editar = async (row) => {
//   try {
//     await loteamentoStore.show(row.id);
//     loteamentoShow.value = !loteamentoShow.value;
//   } catch (error) {
//     $q.notify({
//       color: "negative",
//       message: "Erro ao buscar o modelo de documento",
//       icon: "report_problem",
//     });
//   }
// };

onMounted(async () => {
  try {
    $q.loading.show();
    // await loteamentoStore.index();
    await naturezaStore.index();
    // await naturezaStore.index();
  } catch (e) {
    $q.notify({
      color: "negative",
      message: "Erro ao buscar as minutas no sistema",
      icon: "report_problem",
    });
  } finally {
    $q.loading.hide();
  }
});
</script>