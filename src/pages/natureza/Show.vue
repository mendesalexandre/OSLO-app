<template>
  <modal v-model="model" tamanho="sm" :titulo="titulo">
    <q-card bordered>
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-10 col-sm-12">
            <label for="">Nome</label>
            <q-input v-model="natureza.nome" />
          </div>
          <div class="col-md-2 col-sm-12 col-xs-12">
            <label for="" class="text-caption text-slate-500">Ativo?</label>
            <v-input-check
              class="text-caption text-slate-500"
              v-model="natureza.is_ativo"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <template #rodape>
      <q-card-section>
        <div class="flex justify-end q-gutter-sm">
          <q-btn
            label="Cancelar"
            color="negative"
            icon="close"
            class="shadcn-btn"
            @click="model = false"
          >
            <q-tooltip> Cancelar </q-tooltip>
          </q-btn>

          <q-btn
            label="Salvar"
            color="primary"
            icon="save"
            class="shadcn-btn"
            @click="salvar"
          >
            <q-tooltip> Salvar Loteamento </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
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
  const response = await loteamentoStore.create(loteamento.value);
};
</script>
