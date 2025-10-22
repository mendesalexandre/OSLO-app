<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h4">Movimentos de Caixa</div>
        <div class="text-subtitle2 text-grey-7">Turnos e expedientes</div>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Abrir Caixa" @click="openDialogAbrir()" />
      </div>
    </div>

    <!-- Cards -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-4" v-for="movimento in movimentos" :key="movimento.id">
        <q-card bordered>
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="col">
                <div class="text-h6">{{ movimento.caixa.nome }}</div>
                <div class="text-caption text-grey-7">
                  Aberto em {{ formatDateTime(movimento.data_abertura) }}
                </div>
              </div>
              <div class="col-auto">
                <q-chip :color="getStatusColor(movimento.status)" text-color="white" size="sm">
                  {{ movimento.status }}
                </q-chip>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="q-gutter-sm">
              <div class="row justify-between">
                <span class="text-grey-7">Saldo Inicial:</span>
                <span>{{ formatCurrency(movimento.saldo_inicial_informado) }}</span>
              </div>
              <div class="row justify-between">
                <span class="text-grey-7">Entradas:</span>
                <span class="text-positive">{{ formatCurrency(movimento.total_entradas) }}</span>
              </div>
              <div class="row justify-between">
                <span class="text-grey-7">Saídas:</span>
                <span class="text-negative">{{ formatCurrency(movimento.total_saidas) }}</span>
              </div>
              <q-separator />
              <div class="row justify-between">
                <span class="text-weight-bold">Saldo Calculado:</span>
                <span class="text-h6 text-positive">
                  {{ formatCurrency(movimento.saldo_final_sistema) }}
                </span>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="text-caption text-grey-7">
              <q-icon name="person" size="xs" />
              {{ movimento.usuario_abertura.name }}
            </div>

            <div v-if="movimento.data_fechamento" class="text-caption text-grey-7 q-mt-xs">
              <q-icon name="event" size="xs" />
              Fechado em {{ formatDateTime(movimento.data_fechamento) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section align="right">
            <q-btn v-if="movimento.status === 'ABERTO'" flat dense color="primary" icon="attach_money"
              label="Transações" @click="viewTransactions(movimento)" />
            <q-btn v-if="movimento.status === 'ABERTO'" flat dense color="negative" icon="lock" label="Fechar"
              @click="confirmClose(movimento)" />
            <q-btn v-if="movimento.status === 'FECHADO'" flat dense color="positive" icon="check" label="Conferir"
              @click="conferirMovimento(movimento)" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const loadMovimentos = async () => {
  loading.value = true
  try {
    const response = await api.get('/caixa-movimentos') // ✅ Endpoint correto
    movimentos.value = response.data
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar movimentos'
    })
  } finally {
    loading.value = false
  }
}

const confirmClose = (movimento) => {
  $q.dialog({
    title: 'Fechar Caixa',
    message: 'Informe o saldo contado:',
    prompt: {
      model: '',
      type: 'number',
      label: 'Saldo Final'
    },
    cancel: true
  }).onOk(async (saldoFinal) => {
    try {
      await api.post(`/caixa-movimentos/${movimento.id}/fechar`, {
        saldo_final_informado: parseFloat(saldoFinal),
        observacao_fechamento: 'Fechamento pelo sistema'
      })
      $q.notify({
        type: 'positive',
        message: 'Caixa fechado com sucesso!'
      })
      loadMovimentos()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao fechar caixa'
      })
    }
  })
}
</script>