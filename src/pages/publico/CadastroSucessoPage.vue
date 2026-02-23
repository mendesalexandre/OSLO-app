<template>
  <div class="flex flex-center bg-grey-1" style="min-height: 100vh">
    <div class="q-pa-xl" style="max-width: 500px">
      <q-card flat bordered class="text-center q-pa-xl">
        <q-icon name="mark_email_read" size="80px" color="positive" class="q-mb-md" />

        <div class="text-h5 text-weight-bold q-mb-sm">Verifique seu e-mail</div>

        <div class="text-body1 text-grey-7 q-mb-lg">
          Enviamos um link de verificação para<br>
          <strong class="text-dark">{{ email }}</strong>
        </div>

        <q-separator class="q-my-lg" />

        <div class="text-body2 text-grey-6 q-mb-md">
          Não recebeu o e-mail?
        </div>

        <q-btn
          label="Reenviar E-mail"
          color="orange"
          outline
          no-caps
          @click="reenviar"
          :loading="loading"
          class="q-mb-md"
        />

        <div class="text-caption text-grey-6 q-mt-lg">
          Verifique também sua caixa de spam
        </div>

        <div class="q-mt-xl">
          <router-link to="/login" class="text-orange text-weight-medium">
            ← Voltar para o login
          </router-link>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()

const loading = ref(false)
const email = computed(() => route.query.email || '')

const reenviar = async () => {
  if (!email.value) {
    $q.notify({
      type: 'negative',
      message: 'E-mail não informado',
      position: 'top'
    })
    return
  }

  loading.value = true

  try {
    await api.post('/publica/reenviar-verificacao', {
      email: email.value
    })

    $q.notify({
      type: 'positive',
      message: 'E-mail reenviado com sucesso!',
      caption: 'Verifique sua caixa de entrada.',
      position: 'top'
    })
  } catch (error) {
    console.error('Erro ao reenviar:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.mensagem || 'Erro ao reenviar e-mail',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>
