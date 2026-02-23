<template>
  <q-page padding>
    <!-- Header -->
    <div class="oslo-page-header">
      <div class="row items-center q-gutter-md">
        <q-btn
          flat
          round
          icon="arrow_back"
          @click="$router.push('/protocolo')"
        />
        <div>
          <h1 class="oslo-page-title">Criar Novo Protocolo</h1>
          <p class="oslo-page-subtitle">Preencha os dados do protocolo</p>
        </div>
      </div>
    </div>

    <!-- Formulário -->
    <q-form @submit="salvar" class="q-mt-md">
      <div class="row q-col-gutter-md">
        <!-- Card Principal -->
        <div class="col-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md">Dados do Solicitante</div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <v-label label="Nome do Solicitante" obrigatorio />
                  <q-input
                    v-model="form.solicitante_nome"
                    outlined
                    dense
                    placeholder="Digite o nome completo"
                    :rules="[(val) => !!val || 'Campo obrigatório']"
                  />
                </div>

                <div class="col-12 col-md-3">
                  <v-label label="CPF/CNPJ" />
                  <q-input
                    v-model="form.solicitante_cpf_cnpj"
                    outlined
                    dense
                    placeholder="000.000.000-00"
                    mask="###.###.###-##"
                  />
                </div>

                <div class="col-12 col-md-3">
                  <v-label label="Telefone" />
                  <q-input
                    v-model="form.solicitante_telefone"
                    outlined
                    dense
                    placeholder="(00) 00000-0000"
                    mask="(##) #####-####"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <v-label label="E-mail" />
                  <q-input
                    v-model="form.solicitante_email"
                    outlined
                    dense
                    type="email"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <v-label label="Matrícula" />
                  <q-input
                    v-model="form.matricula"
                    outlined
                    dense
                    placeholder="Digite a matrícula"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Card Observações -->
        <div class="col-12">
          <q-card flat bordered>
            <q-card-section>
              <v-label label="Observações" />
              <q-input
                v-model="form.observacao"
                type="textarea"
                outlined
                rows="4"
                placeholder="Adicione observações sobre este protocolo (opcional)"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Card Atos (Opcional na criação) -->
        <div class="col-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">Atos (Opcional)</div>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar Ato"
                  size="sm"
                  outline
                  no-caps
                  @click="adicionarAto"
                />
              </div>

              <div v-if="form.itens.length === 0" class="text-center text-grey-6 q-pa-lg">
                <l-icon name="inbox" :size="48" />
                <div class="q-mt-sm">Nenhum ato adicionado</div>
                <div class="text-caption">Você pode adicionar atos agora ou após criar o protocolo</div>
              </div>

              <q-table
                v-else
                :rows="form.itens"
                :columns="atosColumns"
                row-key="ato_id"
                flat
                hide-bottom
              >
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      round
                      dense
                      size="sm"
                      icon="delete"
                      color="negative"
                      @click="removerAto(props.rowIndex)"
                    />
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="row justify-end q-gutter-sm q-mt-md">
        <q-btn
          label="Cancelar"
          outline
          color="grey-7"
          no-caps
          @click="$router.push('/protocolo')"
        />
        <q-btn
          type="submit"
          label="Salvar e Continuar"
          color="primary"
          unelevated
          no-caps
          :loading="salvando"
        />
      </div>
    </q-form>

    <!-- Modal Adicionar Ato -->
    <q-dialog v-model="modalAto">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Adicionar Ato</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-md">
            <q-select
              v-model="atoTemp.ato_id"
              :options="atosDisponiveis"
              option-value="id"
              option-label="nome"
              emit-value
              map-options
              label="Ato *"
              outlined
              dense
              use-input
              input-debounce="300"
              @filter="filtrarAtos"
            />

            <q-input
              v-model.number="atoTemp.quantidade"
              type="number"
              label="Quantidade"
              outlined
              dense
              min="1"
            />

            <q-input
              v-model.number="atoTemp.base_calculo"
              type="number"
              label="Base de Cálculo (se aplicável)"
              outlined
              dense
              min="0"
              step="0.01"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
          <q-btn
            label="Adicionar"
            color="primary"
            unelevated
            @click="confirmarAto"
            :disable="!atoTemp.ato_id"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useProtocoloStore } from 'src/stores/protocolo'
import { api } from 'src/boot/axios'

defineOptions({ name: 'ProtocoloCriarPage' })

const router = useRouter()
const $q = useQuasar()
const protocoloStore = useProtocoloStore()

const salvando = ref(false)
const modalAto = ref(false)
const atosDisponiveis = ref([])

const form = reactive({
  solicitante_nome: '',
  solicitante_cpf_cnpj: '',
  solicitante_telefone: '',
  solicitante_email: '',
  matricula: '',
  observacao: '',
  itens: [],
})

const atoTemp = reactive({
  ato_id: null,
  quantidade: 1,
  base_calculo: null,
})

const atosColumns = [
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

async function salvar() {
  salvando.value = true
  try {
    const resultado = await protocoloStore.criar(form)

    if (resultado.sucesso) {
      $q.notify({
        type: 'positive',
        message: 'Protocolo criado com sucesso!',
        position: 'top',
      })

      router.push(`/protocolo/${resultado.dados.uuid}`)
    } else {
      throw new Error(resultado.mensagem || 'Erro ao criar protocolo')
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.mensagem || error.message || 'Erro ao criar protocolo',
      position: 'top',
    })
  } finally {
    salvando.value = false
  }
}

function adicionarAto() {
  atoTemp.ato_id = null
  atoTemp.quantidade = 1
  atoTemp.base_calculo = null
  modalAto.value = true
  carregarAtos()
}

async function carregarAtos(filtro = '') {
  try {
    const { data } = await api.get('/ato', {
      params: { busca: filtro },
    })
    atosDisponiveis.value = data.sucesso ? data.dados : []
  } catch (error) {
    console.error('Erro ao carregar atos:', error)
  }
}

function filtrarAtos(val, update) {
  update(() => {
    carregarAtos(val)
  })
}

function confirmarAto() {
  const ato = atosDisponiveis.value.find((a) => a.id === atoTemp.ato_id)
  if (ato) {
    form.itens.push({
      ato_id: ato.id,
      descricao: ato.nome,
      quantidade: atoTemp.quantidade,
      base_calculo: atoTemp.base_calculo,
    })
    modalAto.value = false
  }
}

function removerAto(index) {
  form.itens.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.oslo-page-header {
  margin-bottom: 24px;
}

.oslo-page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  line-height: 1.3;
}

.oslo-page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}
</style>
