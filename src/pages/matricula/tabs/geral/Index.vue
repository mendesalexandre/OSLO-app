<template>
  <q-card bordered>
    <q-card-section>
      <div class="titulo">
        Dados Principais
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div class="col-md-4 col-sm-12 col-xs-12">
          <v-label label="CNM" />
          <q-select v-model.number="matricula.status_id" />
        </div>

        <div class="col-md-4 col-sm-12 col-xs-12">
          <v-label label="CNM" />
          <q-input v-model.number="matricula.cin" disable class="bg-grey-2" readonly />
        </div>

        <div class="col-md-12 col-sm-12 col-xs-12">
          <v-label label="Descrição do Imóvel" />
          <q-input v-model.number="matricula.descricaoimovel" disable class="bg-grey-2" readonly />
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-card bordered class="q-mt-md">
    <q-card-section>
      <div class="titulo">
        Dados Complementares
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section></q-card-section>
  </q-card>


</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMatriculaStore } from 'src/stores/matricula';
import { computed, ref } from 'vue'

const matriculaStore = useMatriculaStore();
const { matricula, matriculas } = storeToRefs(matriculaStore);

const titulo = computed(() => matricula.value.id ? 'Editar Matrícula' : 'Nova Matrícula');


</script>

<style scoped>
.titulo {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #37474f;
}
</style>