<template>
  <div class="flex flex-center bg-grey-1" style="min-height: 100vh">
    <div class="q-pa-xl" style="max-width: 500px">
      <q-card flat bordered class="text-center q-pa-xl">
        <!-- Loading -->
        <div v-if="loading">
          <q-spinner-hourglass size="80px" color="orange" class="q-mb-md" />
          <div class="text-h6 text-weight-medium">Verificando e-mail...</div>
        </div>

        <!-- Sucesso -->
        <div v-else-if="sucesso">
          <q-icon name="check_circle" size="80px" color="positive" class="q-mb-md" />
          <div class="text-h5 text-weight-bold q-mb-sm">E-mail verificado!</div>
          <div class="text-body1 text-grey-7 q-mb-lg">
            Sua conta foi ativada com sucesso.<br>
            <strong>Você tem 7 dias de teste gratuito.</strong>
          </div>

          <q-btn
            label="Acessar o Sistema"
            color="orange"
            unelevated
            no-caps
            size="md"
            to="/login"
            class="q-mt-md"
          />
        </div>

        <!-- Erro -->
        <div v-else>
          <q-icon name="error" size="80px" color="negative" class="q-mb-md" />
          <div class="text-h5 text-weight-bold q-mb-sm">Erro na verificação</div>
          <div class="text-body1 text-grey-7 q-mb-lg">
            {{ mensagemErro }}
          </div>

          <div class="q-gutter-md">
            <q-btn
              label="Reenviar E-mail"
              color="orange"
              outline
              no-caps
              @click="mostrarReenvio = true"
            />

            <q-btn
              label="Ir para Login"
              color="grey-7"
              flat
              no-caps
              to="/login"
            />
          </div>

          <!-- Dialog para reenvio -->
          <q-dialog v-model="mostrarReenvio">
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Reenviar verificação</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-input
                  v-model="emailReenvio"
                  label="Seu e-mail"
                  type="email"
                  outlined
                  dense
                />
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
                <q-btn
                  label="Enviar"
                  color="orange"
                  unelevated
                  @click="reenviar"
                  :loading="loadingReenvio"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const sucesso = ref(false)
const mensagemErro = ref('')
const mostrarReenvio = ref(false)
const emailReenvio = ref('')
const loadingReenvio = ref(false)

onMounted(async () => {
  const token = route.params.token

  if (!token) {
    loading.value = false
    mensagemErro.value = 'Token de verificação não encontrado.'
    return
  }

  try {
    await api.get(`/publica/verificar-email/${token}`)
    sucesso.value = true
  } catch (error) {
    console.error('Erro ao verificar:', error)
    mensagemErro.value = error.response?.data?.mensagem || 'Token inválido ou expirado.'
  } finally {
    loading.value = false
  }
})

const reenviar = async () => {
  if (!emailReenvio.value) {
    $q.notify({
      type: 'negative',
      message: 'Digite seu e-mail',
      position: 'top'
    })
    return
  }

  loadingReenvio.value = true

  try {
    await api.post('/publica/reenviar-verificacao', {
      email: emailReenvio.value
    })

    $q.notify({
      type: 'positive',
      message: 'E-mail reenviado com sucesso!',
      position: 'top'
    })

    mostrarReenvio.value = false
  } catch (error) {
    console.error('Erro ao reenviar:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.mensagem || 'Erro ao reenviar e-mail',
      position: 'top'
    })
  } finally {
    loadingReenvio.value = false
  }
}
</script>
