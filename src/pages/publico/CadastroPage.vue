<template>
  <div class="cadastro-page">
    <div class="row full-height no-wrap">
      <!-- Coluna Esquerda: Info -->
      <div class="col-5 bg-dark text-white flex column items-center justify-center info-section">
        <div class="q-pa-xl" style="max-width: 400px">
          <div class="text-h3 text-weight-bold text-orange q-mb-md">
            🏛 OSLO
          </div>
          <div class="text-h5 text-weight-medium q-mb-lg">
            Sistema de Gestão Cartorária
          </div>

          <div class="q-mt-xl">
            <div class="benefit-item q-mb-md">
              <q-icon name="check_circle" size="24px" color="positive" class="q-mr-sm" />
              <span class="text-body1">7 dias grátis</span>
            </div>
            <div class="benefit-item q-mb-md">
              <q-icon name="check_circle" size="24px" color="positive" class="q-mr-sm" />
              <span class="text-body1">Sem cartão de crédito</span>
            </div>
            <div class="benefit-item q-mb-md">
              <q-icon name="check_circle" size="24px" color="positive" class="q-mr-sm" />
              <span class="text-body1">Cancele quando quiser</span>
            </div>
            <div class="benefit-item q-mb-md">
              <q-icon name="check_circle" size="24px" color="positive" class="q-mr-sm" />
              <span class="text-body1">Suporte completo</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Coluna Direita: Formulário -->
      <div class="col-7 flex column items-center justify-center form-section">
        <div class="q-pa-xl" style="max-width: 540px; width: 100%">
          <div class="text-h4 text-weight-bold q-mb-xs">Crie sua conta</div>
          <div class="text-body2 text-grey-7 q-mb-xl">
            Teste grátis por 7 dias. Não precisa de cartão.
          </div>

          <q-form @submit="onSubmit" ref="formRef">
            <!-- DADOS DA EMPRESA -->
            <div class="section-title q-mb-md">
              <q-icon name="business" size="20px" class="q-mr-sm" />
              <span class="text-weight-medium">Dados da Empresa</span>
            </div>

            <q-input
              v-model="form.razao_social"
              label="Razão Social *"
              outlined
              dense
              :rules="[val => !!val || 'Campo obrigatório']"
              class="q-mb-md"
            />

            <q-input
              v-model="form.nome_fantasia"
              label="Nome Fantasia"
              outlined
              dense
              class="q-mb-md"
            />

            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-6">
                <q-input
                  v-model="form.cnpj"
                  label="CNPJ *"
                  outlined
                  dense
                  mask="##.###.###/####-##"
                  :rules="[val => !!val || 'Campo obrigatório']"
                  :loading="buscandoCnpj"
                >
                  <template v-slot:append>
                    <q-btn
                      round
                      dense
                      flat
                      icon="search"
                      @click="buscarCnpj"
                      :loading="buscandoCnpj"
                      :disable="!cnpjValido"
                    >
                      <q-tooltip>Buscar dados do CNPJ</q-tooltip>
                    </q-btn>
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input
                  v-model="form.telefone"
                  label="Telefone"
                  outlined
                  dense
                  mask="(##) #####-####"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-lg">
              <div class="col-6">
                <q-select
                  v-model="form.estado"
                  label="Estado"
                  outlined
                  dense
                  :options="estados"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="form.cidade"
                  label="Cidade"
                  outlined
                  dense
                />
              </div>
            </div>

            <!-- ADMINISTRADOR -->
            <div class="section-title q-mb-md">
              <q-icon name="person" size="20px" class="q-mr-sm" />
              <span class="text-weight-medium">Administrador</span>
            </div>

            <q-input
              v-model="form.nome_responsavel"
              label="Nome Completo *"
              outlined
              dense
              :rules="[val => !!val || 'Campo obrigatório']"
              class="q-mb-md"
            />

            <q-input
              v-model="form.email"
              label="E-mail *"
              type="email"
              outlined
              dense
              :rules="[
                val => !!val || 'Campo obrigatório',
                val => /.+@.+\..+/.test(val) || 'E-mail inválido'
              ]"
              class="q-mb-md"
            />

            <div class="row q-col-gutter-md q-mb-lg">
              <div class="col-6">
                <q-input
                  v-model="form.senha"
                  label="Senha *"
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  dense
                  :rules="[
                    val => !!val || 'Campo obrigatório',
                    val => val.length >= 8 || 'Mínimo 8 caracteres'
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input
                  v-model="form.senha_confirmation"
                  label="Confirmar Senha *"
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  outlined
                  dense
                  :rules="[
                    val => !!val || 'Campo obrigatório',
                    val => val === form.senha || 'Senhas não coincidem'
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showPasswordConfirm ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPasswordConfirm = !showPasswordConfirm"
                    />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- Botão Submit -->
            <q-btn
              type="submit"
              label="Criar Conta Grátis"
              color="orange"
              unelevated
              no-caps
              size="md"
              class="full-width q-mb-md"
              :loading="loading"
              style="height: 44px"
            />

            <div class="text-center text-body2 text-grey-7">
              Já tem conta?
              <router-link to="/login" class="text-orange text-weight-medium">
                Fazer login
              </router-link>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import CnpjService from 'src/services/cnpjService'

const $q = useQuasar()
const router = useRouter()

const loading = ref(false)
const buscandoCnpj = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const formRef = ref(null)

const form = ref({
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  telefone: '',
  estado: '',
  cidade: '',
  nome_responsavel: '',
  email: '',
  senha: '',
  senha_confirmation: ''
})

const estados = [
  { label: 'AC', value: 'AC' },
  { label: 'AL', value: 'AL' },
  { label: 'AP', value: 'AP' },
  { label: 'AM', value: 'AM' },
  { label: 'BA', value: 'BA' },
  { label: 'CE', value: 'CE' },
  { label: 'DF', value: 'DF' },
  { label: 'ES', value: 'ES' },
  { label: 'GO', value: 'GO' },
  { label: 'MA', value: 'MA' },
  { label: 'MT', value: 'MT' },
  { label: 'MS', value: 'MS' },
  { label: 'MG', value: 'MG' },
  { label: 'PA', value: 'PA' },
  { label: 'PB', value: 'PB' },
  { label: 'PR', value: 'PR' },
  { label: 'PE', value: 'PE' },
  { label: 'PI', value: 'PI' },
  { label: 'RJ', value: 'RJ' },
  { label: 'RN', value: 'RN' },
  { label: 'RS', value: 'RS' },
  { label: 'RO', value: 'RO' },
  { label: 'RR', value: 'RR' },
  { label: 'SC', value: 'SC' },
  { label: 'SP', value: 'SP' },
  { label: 'SE', value: 'SE' },
  { label: 'TO', value: 'TO' }
]

// Valida se o CNPJ tem 14 dígitos
const cnpjValido = computed(() => {
  return CnpjService.validarCnpj(form.value.cnpj)
})

// Busca dados do CNPJ usando o service
const buscarCnpj = async () => {
  if (!cnpjValido.value) {
    $q.notify({
      type: 'warning',
      message: 'CNPJ inválido',
      caption: 'Digite um CNPJ válido com 14 dígitos',
      position: 'top'
    })
    return
  }

  buscandoCnpj.value = true

  try {
    const dados = await CnpjService.buscarDados(form.value.cnpj)

    // Preencher campos automaticamente
    form.value.razao_social = dados.razao_social
    form.value.nome_fantasia = dados.nome_fantasia
    form.value.email = dados.email || form.value.email
    form.value.telefone = dados.telefone
    form.value.estado = dados.estado
    form.value.cidade = dados.cidade

    $q.notify({
      type: 'positive',
      message: 'Dados encontrados!',
      caption: dados.razao_social,
      position: 'top',
      icon: 'check_circle'
    })
  } catch (error) {
    console.error('Erro ao buscar CNPJ:', error)

    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao buscar dados do CNPJ',
      position: 'top',
      icon: 'error'
    })
  } finally {
    buscandoCnpj.value = false
  }
}

const onSubmit = async () => {
  loading.value = true

  try {
    const response = await api.post('/publica/cadastro', form.value)

    $q.notify({
      type: 'positive',
      message: 'Cadastro realizado com sucesso!',
      caption: 'Verifique seu e-mail para ativar sua conta.',
      position: 'top',
      timeout: 5000
    })

    // Redirecionar para página de sucesso
    router.push({
      path: '/cadastro-sucesso',
      query: { email: form.value.email }
    })
  } catch (error) {
    console.error('Erro ao cadastrar:', error)

    const mensagem = error.response?.data?.mensagem || 'Erro ao realizar cadastro'
    const erros = error.response?.data?.dados || {}

    // Mostrar erros de validação
    if (Object.keys(erros).length > 0) {
      const primeiroErro = Object.values(erros)[0]
      $q.notify({
        type: 'negative',
        message: Array.isArray(primeiroErro) ? primeiroErro[0] : primeiroErro,
        position: 'top'
      })
    } else {
      $q.notify({
        type: 'negative',
        message: mensagem,
        position: 'top'
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.cadastro-page {
  height: 100vh;
  overflow: hidden;
}

.info-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.form-section {
  background: #fff;
  overflow-y: auto;
}

.benefit-item {
  display: flex;
  align-items: center;
}

.section-title {
  display: flex;
  align-items: center;
  color: #1a1a1a;
  font-size: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}
</style>
