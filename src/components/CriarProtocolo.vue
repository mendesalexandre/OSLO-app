<template>
  <modal v-model="model" :titulo="titulo" tamanho="lg">
    <!-- Seção Principal -->
    <q-card bordered>
      <q-card-section class="q-pa-none">
        <div class="corpo-secao">
          <q-icon name="fa-regular fa-file-plus" class="q-mr-sm" />
          <span class="titulo-secao">Informações do Protocolo</span>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <!-- Tipo de Protocolo -->
        <div class="col-12">
          <v-label label="Tipo de Protocolo" required />
          <q-btn-toggle v-model="getOpcaoSelecionada" :options="[
            { label: 'Normal', value: 'NORMAL', icon: 'fa-duotone fa-file' },
            { label: 'Orçamento', value: 'ORCAMENTO', icon: 'fa-duotone fa-calculator' },
            { label: 'Processo Interno', value: 'PROCESSO_INTERNO', icon: 'fa-duotone fa-folder-gear' },
            { label: 'Exame e Cálculo', value: 'EXAME_CALCULO', icon: 'fa-duotone fa-magnifying-glass-chart' }
          ]" spread no-caps flat class="protocol-toggle q-mt-sm" />
        </div>
      </q-card-section>



      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Meio de Solicitação -->
          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-label label="Meio de Solicitação" required />

            <q-select v-model="protocolo.meio_solicitacao_id" :options="meiosSolicitacao" option-value="id" dense
              option-label="nome" outlined input-debounce="500" placeholder="Selecione o meio de solicitação">
              <template v-slot:prepend>
                <q-icon name="fa-duotone fa-envelope" size="14px" />
              </template>

              <template v-slot:selected-item="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      <q-chip icon-remove="none">
                        {{ scope.opt.nome }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="fa-duotone fa-envelope" size="14px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nome }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-center text-grey">
                    <q-icon name="fa-duotone fa-circle-exclamation" class="q-mb-sm" size="14px" />
                    <div>Nenhum meio de solicitação encontrado</div>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- NATUREZA FORMAL DO TITULO -->
          <div class="col-12">
            <v-label label="Natureza Formal do Título" obrigatorio />
            <div class="row q-gutter-sm">
              <div class="col">
                <q-select v-model="clienteSelecionado" :options="options" option-value="id" option-label="nome"
                  use-input outlined dense input-debounce="300" @filter="filterClients" :loading="loading"
                  hide-dropdown-icon placeholder="digite o nome ou documento para buscar...">
                  <template v-slot:prepend>
                    <q-icon name="fa-regular fa-user" size="14px" />
                  </template>

                  <template v-slot:selected-item="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-avatar size="24px" color="blue-grey-6" text-color="white">
                          {{ scope.opt.nome.charAt(0).toUpperCase() }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-medium text-primary">
                          {{ scope.opt.nome }}
                        </q-item-label>
                        <q-item-label caption class="text-grey-6">
                          {{ scope.opt.cpf_cnpj }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-avatar size="32px" color="blue-grey-6" text-color="white">
                          {{ scope.opt.nome.charAt(0).toUpperCase() }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-medium text-primary">
                          {{ scope.opt.nome }}
                        </q-item-label>
                        <q-item-label caption class="text-grey-6">
                          {{ scope.opt.cpf_cnpj }} • {{ scope.opt.tipo || 'Cliente' }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-center">
                        <div class="text-grey-5 q-py-md">
                          <q-icon name="fa-duotone fa-magnifying-glass" size="2em" />
                          <div class="q-mt-sm">Nenhum cliente encontrado</div>
                          <div class="text-caption">
                            Digite pelo menos 2 caracteres
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>


              <div class="col-auto">
                <q-btn icon="fa-regular fa-user-plus" color="grey-5" outline @click="abrirModalCriarCliente" size="sm"
                  class="full-height">
                  <q-tooltip>Adicionar novo cliente</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Serviço Principal e Estado -->
          <div class="col-md-8 col-sm-12">
            <v-label label="Serviço Principal" required />

            <q-select v-model="protocolo.natureza_id" :options="servicos" option-value="id" option-label="nome" outlined
              dense input-debounce="500" placeholder="Selecione o serviço principal">


              <template v-slot:selected-item="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      <q-chip icon-remove="none">
                        {{ scope.opt.nome }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="fa-duotone fa-briefcase" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nome }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-center text-grey">
                    <q-icon name="fa-duotone fa-circle-exclamation" size="2em" class="q-mb-sm" />
                    <div>Nenhum serviço encontrado</div>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <v-label label="Estado" required />

            <q-select v-model="protocolo.estado_id" :options="estados" option-value="id" option-label="nome" outlined
              dense input-debounce="500" placeholder="Selecione o estado">
              <template v-slot:prepend>
                <q-icon name="fa-duotone fa-map-location" size="14px" />
              </template>

              <template v-slot:selected-item="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      <q-chip icon-remove="none">
                        {{ scope.opt.nome }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="fa-duotone fa-map-location" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nome }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.sigla }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-center text-grey">
                    <q-icon name="fa-duotone fa-circle-exclamation" size="2em" class="q-mb-sm" />
                    <div>Nenhum estado encontrado</div>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Solicitante -->
          <div class="col-12">
            <v-label label="Solicitante" obrigatorio />
            <div class="row q-gutter-sm">
              <div class="col">
                <q-select v-model="clienteSelecionado" :options="options" option-value="id" option-label="nome"
                  use-input outlined dense input-debounce="300" @filter="filterClients" :loading="loading"
                  hide-dropdown-icon placeholder="digite o nome ou documento para buscar...">
                  <template v-slot:prepend>
                    <q-icon name="fa-regular fa-user" size="14px" />
                  </template>

                  <template v-slot:selected-item="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-avatar size="24px" color="blue-grey-6" text-color="white">
                          {{ scope.opt.nome.charAt(0).toUpperCase() }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-medium text-primary">
                          {{ scope.opt.nome }}
                        </q-item-label>
                        <q-item-label caption class="text-grey-6">
                          {{ scope.opt.cpf_cnpj }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-avatar size="32px" color="blue-grey-6" text-color="white">
                          {{ scope.opt.nome.charAt(0).toUpperCase() }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-medium text-primary">
                          {{ scope.opt.nome }}
                        </q-item-label>
                        <q-item-label caption class="text-grey-6">
                          {{ scope.opt.cpf_cnpj }} • {{ scope.opt.tipo || 'Cliente' }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-center">
                        <div class="text-grey-5 q-py-md">
                          <q-icon name="fa-duotone fa-magnifying-glass" size="2em" />
                          <div class="q-mt-sm">Nenhum cliente encontrado</div>
                          <div class="text-caption">
                            Digite pelo menos 2 caracteres
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-auto">
                <q-btn icon="fa-regular fa-user-plus" color="grey-5" outline @click="abrirModalCriarCliente"
                  class="full-height" size="sm">
                  <q-tooltip>Adicionar novo cliente</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>




          <div class="col-12">
            <v-label label="Interessado" obrigatorio />
            <div class="row q-gutter-sm">
              <div class="col">
                <q-select v-model="clienteSelecionado" :options="options" option-value="id" option-label="nome"
                  use-input outlined dense input-debounce="300" @filter="filterClients" :loading="loading"
                  hide-dropdown-icon placeholder="digite o nome ou documento para buscar...">
                  <template v-slot:prepend>
                    <q-icon name="fa-regular fa-user" size="14px" />
                  </template>

                  <template v-slot:selected-item="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-avatar size="24px" color="blue-grey-6" text-color="white">
                          {{ scope.opt.nome.charAt(0).toUpperCase() }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-medium text-primary">
                          {{ scope.opt.nome }}
                        </q-item-label>
                        <q-item-label caption class="text-grey-6">
                          {{ scope.opt.cpf_cnpj }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-avatar size="32px" color="blue-grey-6" text-color="white">
                          {{ scope.opt.nome.charAt(0).toUpperCase() }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-medium text-primary">
                          {{ scope.opt.nome }}
                        </q-item-label>
                        <q-item-label caption class="text-grey-6">
                          {{ scope.opt.cpf_cnpj }} • {{ scope.opt.tipo || 'Cliente' }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-center">
                        <div class="text-grey-5 q-py-md">
                          <q-icon name="fa-duotone fa-magnifying-glass" size="2em" />
                          <div class="q-mt-sm">Nenhum cliente encontrado</div>
                          <div class="text-caption">
                            Digite pelo menos 2 caracteres
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>


              <div class="col-auto">
                <q-btn icon="fa-regular fa-user-plus" color="grey-5" outline @click="abrirModalCriarCliente" size="sm"
                  class="full-height">
                  <q-tooltip>Adicionar novo cliente</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Cartório -->
          <div class="col-12">
            <v-label label="Cartório" obrigatorio />

            <q-select v-model="protocolo.cartorio_id" :options="cartorios" option-value="id" option-label="nome"
              outlined dense input-debounce="500" placeholder="Selecione o cartório">
              <template v-slot:prepend>
                <q-icon name="fa-duotone fa-building-columns" size="14px" />
              </template>

              <template v-slot:selected-item="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      <q-chip icon-remove="none">
                        {{ scope.opt.nome }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="fa-duotone fa-building-columns" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nome }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.endereco || 'Cartório' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-center text-grey">
                    <q-icon name="fa-duotone fa-circle-exclamation" size="2em" class="q-mb-sm" />
                    <div>Nenhum cartório encontrado</div>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>


          <!-- Observações -->
          <!-- <div class="col-12">
            <v-label label="Observações" />
            <q-input v-model="observacoes" type="textarea" rows="3" outlined dense
              placeholder="Informações adicionais sobre o protocolo..." class="custom-input">
              <template v-slot:prepend>
                <q-icon name="fa-duotone fa-note-sticky" size="14px" />
              </template>
            </q-input>
          </div> -->
        </div>
      </q-card-section>
    </q-card>

    <template v-slot:rodape>
      <q-card-section>
        <div class="row justify-between items-center">
          <div class="row q-gutter-sm">
            <q-btn label="Cancelar" color="grey-7" outline @click="cancelar" icon="fa-duotone fa-xmark"
              :disable="salvando" />
            <q-btn label="Criar Protocolo" color="primary" icon="fa-duotone fa-check" @click="salvar"
              :loading="salvando" :disable="!formValido">
              <template v-slot:loading>
                <q-spinner class="q-mr-sm" />
                Salvando...
              </template>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </template>
  </modal>

  <!-- Modal de sucesso -->
  <q-dialog v-model="mostrarSucesso" persistent>
    <q-card flat bordered class="success-modal">
      <q-card-section class="q-pa-none">
        <div class="success-header">
          <q-icon name="fa-duotone fa-circle-check" class="q-mr-sm" />
          <span class="success-title">Protocolo Criado com Sucesso!</span>
        </div>
      </q-card-section>

      <q-card-section class="text-center q-pa-lg">
        <q-icon name="fa-duotone fa-circle-check" size="4rem" color="green-6" class="q-mb-md" />
        <div class="text-h6 q-mb-sm text-grey-8">Protocolo Criado!</div>
        <div class="text-body2 text-grey-7 q-mb-lg">
          Protocolo
          <strong class="text-primary">{{ protocoloCriado?.codigo }}</strong>
          foi criado com sucesso.
        </div>
        <div class="row q-gutter-sm justify-center">
          <q-btn label="Criar Novo" outline color="primary" @click="criarNovo" icon="fa-duotone fa-plus" />
          <q-btn label="Fechar" color="primary" @click="mostrarSucesso = false" icon="fa-duotone fa-check" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <ProtocoloShow v-model="showModalProtocolo" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const model = defineModel({ default: false });
const showModalProtocolo = ref(false);

const titulo = ref("Criar Novo Protocolo");
const salvando = ref(false);
const mostrarSucesso = ref(false);
const protocoloCriado = ref(null);
const observacoes = ref("");

const getOpcaoSelecionada = ref("NORMAL");

// Dados mockados para o exemplo - substitua pelas suas stores/APIs
const protocolo = ref({
  meio_solicitacao_id: null,
  estado_id: null,
  natureza_id: null,
  cartorio_id: null
});

const meiosSolicitacao = ref([
  { id: 1, nome: 'Presencial' },
  { id: 2, nome: 'Online' },
  { id: 3, nome: 'Telefone' },
  { id: 4, nome: 'E-mail' }
]);

const servicos = ref([
  { id: 1, nome: 'Certidão de Nascimento' },
  { id: 2, nome: 'Certidão de Casamento' },
  { id: 3, nome: 'Certidão de Óbito' },
  { id: 4, nome: 'Reconhecimento de Firma' }
]);

const estados = ref([
  { id: 1, nome: 'São Paulo', sigla: 'SP' },
  { id: 2, nome: 'Rio de Janeiro', sigla: 'RJ' },
  { id: 3, nome: 'Minas Gerais', sigla: 'MG' },
  { id: 4, nome: 'Bahia', sigla: 'BA' }
]);

const cartorios = ref([
  { id: 1, nome: '1º Cartório de Registro Civil', endereco: 'Centro' },
  { id: 2, nome: '2º Cartório de Registro Civil', endereco: 'Vila Nova' },
  { id: 3, nome: 'Cartório de Notas', endereco: 'Centro' }
]);

const dominioSelecionado = ref(1);

const router = useRouter();

// Validação do formulário
const formValido = computed(() => {
  return !!(
    protocolo.value.meio_solicitacao_id &&
    protocolo.value.estado_id &&
    protocolo.value.natureza_id &&
    protocolo.value.cartorio_id &&
    clienteSelecionado.value
  );
});

const salvar = async () => {
  if (!formValido.value) {
    $q.notify({
      color: "warning",
      message: "Preencha todos os campos obrigatórios",
      icon: "fa-duotone fa-triangle-exclamation",
      position: "top-right",
    });
    return;
  }

  salvando.value = true;

  try {
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 2000));

    const protocoloCriadoMock = {
      codigo: 'PROT-2025-001',
      uuid: '123e4567-e89b-12d3-a456-426614174000'
    };

    protocoloCriado.value = protocoloCriadoMock;
    model.value = false;

    $q.notify({
      color: "positive",
      message: `Protocolo ${protocoloCriadoMock.codigo} criado! Redirecionando...`,
      icon: "fa-duotone fa-circle-check",
      timeout: 2000,
      position: "top-right",
    });

    // Redireciona direto para protocolo.geral (comentado para demo)
    // router.push({
    //   name: "protocolo.geral",
    //   params: { id: protocoloCriadoMock.uuid },
    // });

  } catch (error) {
    console.error("Erro ao salvar o protocolo:", error);
    $q.notify({
      color: "negative",
      message: error?.response?.data?.message || "Erro ao criar o protocolo.",
      icon: "fa-duotone fa-circle-exclamation",
      position: "top-right",
    });
  } finally {
    salvando.value = false;
  }
};

const cancelar = () => {
  model.value = false;
  resetarForm();
};

const resetarForm = () => {
  protocolo.value.meio_solicitacao_id = null;
  protocolo.value.estado_id = null;
  protocolo.value.natureza_id = null;
  protocolo.value.cartorio_id = null;
  clienteSelecionado.value = null;
  observacoes.value = "";
  getOpcaoSelecionada.value = "NORMAL";
  options.value = [];
};

const criarNovo = () => {
  mostrarSucesso.value = false;
  resetarForm();
  model.value = true;
};

// FILTRO DO CLIENTE
const clienteSelecionado = ref(null);
const options = ref([]);
const loading = ref(false);

// Mock de clientes para demonstração
const clientesMock = [
  { id: 1, nome: 'João Silva Santos', cpf_cnpj: '123.456.789-00', tipo: 'Pessoa Física' },
  { id: 2, nome: 'Maria Oliveira Costa', cpf_cnpj: '987.654.321-00', tipo: 'Pessoa Física' },
  { id: 3, nome: 'Empresa ABC Ltda', cpf_cnpj: '12.345.678/0001-90', tipo: 'Pessoa Jurídica' },
  { id: 4, nome: 'José Carlos Pereira', cpf_cnpj: '456.789.123-00', tipo: 'Pessoa Física' }
];

const filterClients = (val, update) => {
  if (val.length < 2) {
    update(() => {
      options.value = [];
    });
    return;
  }

  loading.value = true;

  // Simular busca com delay
  setTimeout(() => {
    update(() => {
      const needle = val.toLowerCase();
      options.value = clientesMock.filter(
        cliente => cliente.nome.toLowerCase().includes(needle) ||
          cliente.cpf_cnpj.includes(needle)
      );
    });
    loading.value = false;
  }, 500);
};

const abrirModalCriarCliente = () => {
  showModalProtocolo.value = !showModalProtocolo.value;
  model.value = !model.value;
};

// Watch para resetar form quando modal abre
watch(model, (newVal) => {
  if (newVal) {
    resetarForm();
  }
});
</script>