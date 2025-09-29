<template>
  <modal v-model="model" :titulo="titulo" tamanho="lg" cor-titulo-cabecalho="modal-titulo">
    <!-- Seção Principal -->
    <q-card bordered>
      <q-card-section class="q-pa-none">
        <div class="corpo-secao">
          <q-icon name="fa-regular fa-file-plus" class="q-mr-sm" />
          <span class="titulo-secao">Informações do Protocolo</span>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Tipo de Protocolo -->
        <div class="col-12 grupo-tipo-protocolo">
          <v-label label="Tipo de Protocolo" obrigatorio />
          <q-btn-toggle v-model="getOpcaoSelecionada" :options="[
            { label: 'Normal', value: 'NORMAL', icon: 'fa-regular fa-file' },
            { label: 'Orçamento', value: 'ORCAMENTO', icon: 'fa-regular fa-calculator' },
            { label: 'Processo Interno', value: 'PROCESSO_INTERNO', icon: 'fa-regular fa-folder-gear' },
            { label: 'Exame e Cálculo', value: 'EXAME_CALCULO', icon: 'fa-regular fa-magnifying-glass-chart' }
          ]" spread unelevated class="tipo-protocolo" />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- Meio de Solicitação -->
          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-label label="Meio de Solicitação" obrigatorio />
            <q-select v-model="protocolo.meio_solicitacao_id" :options="meiosSolicitacao" option-value="id" dense
              option-label="nome" outlined input-debounce="500" placeholder="Selecione o meio de solicitação" emit-value
              map-options>
              <!-- <template v-slot:prepend>
                <q-icon name="fa-duotone fa-envelope" size="14px" />
              </template> -->

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
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nome }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-center text-grey">
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
                  hide-dropdown-icon placeholder="digite a natureza para buscar...">
                  <!-- <template v-slot:before>
                    <q-icon name="fa-regular fa-search" size="14px" />
                  </template> -->

                  <template v-slot:selected-item="scope">
                    <q-item v-bind="scope.itemProps">
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
                <q-btn icon="fa-regular fa-user-plus" color="grey-5" outline @click="abrirModalCriarCliente" size="8px"
                  class="full-height">
                  <q-tooltip>Adicionar novo cliente</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Serviço Principal e Estado -->
          <div class="col-md-8 col-sm-12">
            <v-label label="Serviço Principal" obrigatorio />

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
            <v-label label="Estado" obrigatorio />

            <q-select v-model="protocolo.estado_id" :options="estados" option-value="id" option-label="nome" outlined
              dense input-debounce="500" placeholder="Selecione o estado">
              <template v-slot:selected-item="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      <q-chip icon-remove="none">
                        <!-- {{ scope.opt.nome }}/{{ scope.opt.sigla }} -->
                        {{ scope.opt.nome }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <!-- <q-item-label>{{ scope.opt.nome }}/{{ scope.opt.sigla }}</q-item-label> -->
                    <q-item-label>{{ scope.opt.nome }}</q-item-label>
                    <!-- <q-item-label caption>{{ scope.opt.sigla }}</q-item-label> -->
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
                  <!-- <template v-slot:before>
                    <q-icon name="fa-regular fa-search" size="14px" />
                  </template> -->

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
                  class="full-height" size="8px">
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
                <q-btn icon="fa-regular fa-user-plus" color="grey-5" outline @click="abrirModalCriarCliente" size="8px"
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
        </div>
      </q-card-section>
    </q-card>

    <template v-slot:rodape>
      <q-card-section>
        <div class="flex justify-between">
          <div>
            <q-btn label="Cancelar" color="red-7" outline @click="cancelar" icon="fa-duotone fa-xmark" size="sm"
              :disable="salvando" />
          </div>
          <div class="q-mr-md">
            <q-btn label="Salvar" color="blue-10" icon="fa-regular fa-check" @click="salvar" outline size="sm"
              :loading="salvando">
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

  <ProtocoloShow v-model="showModalProtocolo" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useEstadoStore } from "src/stores/estado";

const $q = useQuasar();
const model = defineModel({ default: false });
const showModalProtocolo = ref(false);



const estadoStore = useEstadoStore();
const { estado, estados } = storeToRefs(estadoStore);

const titulo = ref("Criar Novo Protocolo");
const salvando = ref(false);
const mostrarSucesso = ref(false);
const protocoloCriado = ref(null);
const observacoes = ref("");

const getOpcaoSelecionada = ref("NORMAL");

// Dados mockados para o exemplo - substitua pelas suas stores/APIs
const protocolo = ref({
  meio_solicitacao_id: 1,
  estado_id: null,
  natureza_id: null,
  cartorio_id: null
});

const meiosSolicitacao = ref([
  { id: 1, nome: 'Balcão de Atendimento' },
  { id: 2, nome: 'Online' },
  { id: 3, nome: 'Telefone' },
  { id: 4, nome: 'E-mail' }
]);

const servicos = ref([
  { id: 1, nome: 'Compra e Venda' },
  { id: 2, nome: 'Cédula de Crédito' },
  { id: 3, nome: 'Abertura de Matrícula' },
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

<style lang="scss" scoped>
.corpo-secao {
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  // border-radius: 2px;

  .titulo-secao {
    font-size: 0.875rem;
    font-weight: 500;
    color: #37474f;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .q-icon {
    color: #607d8b;
    font-size: 1rem;
  }
}

.grupo-tipo-protocolo {
  :deep(.q-btn) {
    color: #37474f;
    border-radius: 2px !important;
    border: 1px solid #e0e0e0 !important;
    // padding: 8px 16px;
    /* ajuste conforme necessário */

    .q-btn__content {
      padding: 0;
      margin: 0;
    }

    .q-icon {
      font-size: 16px;
    }

    &.q-btn--outline {
      border: 1px solid #e0e0e0;
      background-color: white;
    }

    /* Botão selecionado - quando tem bg-primary */
    &.bg-primary {
      border-color: $primary !important;
    }

    /* Alternativa usando aria-pressed */
    &[aria-pressed="true"] {
      border-color: $primary !important;
    }

    /* Ajusta o q-focus-helper para cobrir 100% */
    .q-focus-helper {
      background-color: currentColor;
      opacity: 0;
      border-radius: inherit;
    }

    /* Hover */
    &:hover .q-focus-helper {
      opacity: 0.1;
    }

    /* Ou force o hover diretamente no botão */
    &:hover {
      // background-color: rgba(0, 0, 0, 0.04) !important;
    }

    /* Hover no botão selecionado */
    &.bg-primary:hover,
    &[aria-pressed="true"]:hover {
      // background-color: #1565c0 !important;
      /* Azul mais escuro */
    }
  }
}

:deep(.q-btn-group) {
  column-gap: 4px !important;
}
</style>