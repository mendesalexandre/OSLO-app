<template>
  <modal v-model="model" persistente :titulo="titulo" tamanho="xl" card-completo @fechar="onCancelar">
    <template #controles>
      <div class="justify-between items-center ">
        <q-btn color="blue-8" flat round size="sm" outline icon="fa-solid fa-microchip-ai">
          <q-tooltip>Sincronizar arquivos</q-tooltip>
        </q-btn>

        <q-btn icon="fa-regular fa-xmark" flat round dense @click="onCancelar" size="sm" />
        <q-btn icon="fa-regular fa-print" flat round dense @click="onCancelar" size="sm" />
      </div>

    </template>
    <template #tabs>
      <q-tabs v-model="tab" align="left" class="q-tabs-header">
        <q-tab name="dados" label="Dados" />
        <q-tab name="atos" label="Atos Registrados" />
        <q-tab name="registros" label="Registros Posteriores" />
        <q-tab name="proprietarios" label="Ex-Proprietários" />
        <q-tab name="protocolos" label="Protocolos" />
        <q-tab name="cnib" label="CNIB" />
        <q-tab name="ocorrencias" label="Ocorrências" />
      </q-tabs>
    </template>
    <!-- Tabs -->
    <q-tab-panels v-model="tab" keep-alive style="box-shadow: none !important;
    padding: 0 !important; margin: 0 !important;">
      <q-tab-panel name="dados" class="no-padding">
        <Geral />
      </q-tab-panel>
    </q-tab-panels>
    <!-- Conteúdo das Tabs -->
  </modal>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import Geral from "./tabs/geral/Index.vue";
import { useMatriculaStore } from "src/stores/matricula";
defineOptions({
  name: "MatriculaShow",
});

const tab = ref("dados");
const model = defineModel({ default: false });

const matriculaStore = useMatriculaStore();
const { matricula, matriculas } = storeToRefs(matriculaStore);

const titulo = computed(() =>
  matricula?.value.matricula ? `Matrícula ${matricula.value.matricula}` : "Nova Matrícula"
);

const onCancelar = () => {
  model.value = !model.value;
};
</script>