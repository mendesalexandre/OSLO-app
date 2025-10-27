<template>
  <q-card bordered>
    <q-card-section> DOI - Declaração Imobiliária </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <v-label label="Informar o cookie do navegador pra iniciar a importação dos arquivos" :obrigatorio="true"
            :ajuda="'Informar o cookie do navegador pra iniciar a importação dos arquivos'"></v-label>
          <q-input outlined dense v-model="configuracao.valor" />
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row q-gutter-md justify-end">
        <q-btn class="q-mt-md" label="Salvar" color="primary" @click="salvar" icon="eva-checkmark-outline" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useConfiguracaoStore } from 'src/stores/configuracao';
import { onMounted, ref } from 'vue';

defineOptions({
  name: "ConfiguracaoEstatisticaIndex",
});

const configuracaoStore = useConfiguracaoStore();
const { configuracao } = storeToRefs(configuracaoStore);
const valor = ref("");
const chave = ref("CONFIG_DOI_WEB_COOKIE");
async function salvar() {
  const resposta = await configuracaoStore.salvar({
    chave: chave.value,
    valor: valor.value
  });
  console.log(resposta);
  valor.value = resposta.data?.valor
}

onMounted(async () => {
  console.log("mounted");
  console.log(chave.value);
  const resposta = await configuracaoStore.show(chave.value);
  console.log(resposta);
});
</script>