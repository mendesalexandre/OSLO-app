<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h4">Caixas</div>
        <div class="text-subtitle2 text-grey-7">Cadastro de caixas disponíveis</div>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Novo Caixa" @click="openDialog()" />
      </div>
    </div>

    <!-- Cards -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-4" v-for="caixa in caixas" :key="caixa.id">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="col">
                <div class="text-h6">{{ caixa.nome }}</div>
                <div class="text-caption text-grey-7">{{ caixa.descricao }}</div>
              </div>
              <div class="col-auto">
                <q-chip :color="caixa.is_ativo ? 'positive' : 'grey'" text-color="white" size="sm">
                  {{ caixa.is_ativo ? 'Ativo' : 'Inativo' }}
                </q-chip>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="q-gutter-sm">
              <div class="row justify-between">
                <span class="text-grey-7">Saldo Atual:</span>
                <span class="text-h6 text-positive">{{ formatCurrency(caixa.saldo_atual) }}</span>
              </div>
              <div class="row justify-between text-caption">
                <span class="text-grey-7">Requer Abertura:</span>
                <span>{{ caixa.requer_abertura ? 'Sim' : 'Não' }}</span>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat dense color="primary" icon="open_in_new" label="Abrir" @click="abrirCaixa(caixa)"
              :disable="!caixa.is_ativo" />
            <q-btn flat color="primary" icon="edit" @click="openDialog(caixa)" />
            <q-btn flat color="negative" icon="delete" @click="confirmDelete(caixa)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const loadCaixas = async () => {
  loading.value = true
  try {
    const response = await api.get('/caixas') // ✅ Plural
    caixas.value = response.data
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar caixas'
    })
  } finally {
    loading.value = false
  }
}

const abrirCaixa = (caixa) => {
  router.push({
    name: 'caixa-movimentos',
    params: { caixaId: caixa.id }
  })
}
</script>