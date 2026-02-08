<template>
  <modal v-model="model" tamanho="sm" :titulo="titulo">
    <q-card flat bordered>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-md-10 col-sm-12">
            <label class="oslo-label">Nome</label>
            <q-input v-model="natureza.nome" outlined dense />
          </div>
          <div class="col-md-2 col-sm-12 col-xs-12">
            <label class="oslo-label">Ativo?</label>
            <v-input-check v-model="natureza.is_ativo" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <template #rodape>
      <div class="flex justify-end q-gutter-sm">
        <q-btn
          label="Cancelar"
          flat
          no-caps
          color="grey-7"
          @click="model = false"
        />
        <q-btn
          label="Salvar"
          color="primary"
          unelevated
          no-caps
          icon="save"
          @click="salvar"
        />
      </div>
    </template>
  </modal>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useNaturezaStore } from "src/stores/natureza";
import { computed } from "vue";

const model = defineModel({ default: false });

const naturezaStore = useNaturezaStore();
const { natureza } = storeToRefs(naturezaStore);

const titulo = computed(() =>
  natureza?.value?.id ? "Editar Natureza" : "Nova Natureza"
);

const salvar = async () => {
  // TODO: implement save
};
</script>

<style lang="scss" scoped>
.oslo-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 4px;
}
</style>
