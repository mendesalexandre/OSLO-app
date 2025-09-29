<template>
  <modal titulo="Cadastrar novo cliente" v-model="model" tamanho="lg">
    <!-- Dados Pessoais -->
    <q-card flat bordered class="mb-3">
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-1 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">ID</label>
            <q-input outlined dense disabled />
          </div>

          <div class="col-md-8 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Nome</label>
            <q-input v-model="cliente.nome" outlined dense placeholder="Nome completo" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Ativo?</label>
            <q-checkbox v-model="cliente.is_ativo" label="Cliente ativo" color="primary" />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Tipo Pessoa</label>
            <q-select v-model="cliente.tipo_pessoa_id" outlined dense :options="tiposPessoa" option-value="id"
              :option-label="(tipo) => `${tipo.id} - ${tipo.nome}`" emit-value map-options
              placeholder="Selecione o tipo" />
          </div>

          <div class="col-md-5 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">CPF/CNPJ</label>
            <q-input v-model="cliente.cpf_cnpj" :mask="mascaraCpfCnpj" unmasked-value outlined dense
              @blur="validarCpfCnpj" :error="erroCpfCnpj" :error-message="mensagemErroCpfCnpj"
              placeholder="Digite o CPF ou CNPJ" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Data de Nascimento</label>
            <q-input type="date" v-model="cliente.data_nascimento" outlined dense />
          </div>

          <div class="col-md-12 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">E-mail</label>
            <q-input v-model="cliente.email" outlined dense type="email" placeholder="exemplo@email.com" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Passaporte</label>
            <q-input v-model="cliente.passaporte" outlined dense placeholder="Número do passaporte" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">RG</label>
            <q-input v-model="cliente.registro_geral" outlined dense placeholder="Registro Geral" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">CNH</label>
            <q-input v-model="cliente.cnh" outlined dense placeholder="Carteira de Habilitação" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Identidade Profissional</label>
            <q-input v-model="cliente.registro_profissional" outlined dense placeholder="Registro profissional" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- SISCOAF -->
    <q-card flat bordered class="mb-3">
      <q-card-section>
        <h6 class="text-primary fw-semibold text-uppercase mb-3 border-bottom pb-2">
          Informações SISCOAF
        </h6>

        <div class="row q-col-gutter-md">
          <div class="col-md-4 col-sm-6 col-xs-12">
            <q-checkbox v-model="cliente.pessoa_falecida" label="Pessoa Falecida" color="primary" />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <q-checkbox v-model="cliente.menor_idade" label="Menor de Idade" color="primary" />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <q-checkbox v-model="cliente.incapaz" label="Incapaz" color="primary" />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <q-checkbox v-model="cliente.pessoa_politicamente_exposta" label="Pessoa Politicamente Exposta"
              color="primary" />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <q-checkbox v-model="cliente.servidor_publico" label="Servidor Público" color="primary" />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <q-checkbox v-model="cliente.pessoa_obrigada" label="Pessoa Obrigada" color="primary" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dados de Contato -->
    <q-card flat bordered class="mb-3">
      <q-card-section>
        <h6 class="text-primary fw-semibold text-uppercase mb-3 border-bottom pb-2">
          Dados de Contato
        </h6>

        <div class="row q-col-gutter-sm">
          <div class="col-md-6 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Telefone</label>
            <q-input mask="(##) ####-####" unmasked-value outlined dense placeholder="(11) 1234-5678" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Celular</label>
            <q-input mask="(##) #####-####" unmasked-value outlined dense placeholder="(11) 99999-9999" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Estado Civil -->
    <q-card flat bordered class="mb-3">
      <q-card-section>
        <h6 class="text-primary fw-semibold text-uppercase mb-3 border-bottom pb-2">
          Estado Civil
        </h6>

        <div class="row q-col-gutter-sm">
          <div class="col-md-6 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Estado Civil</label>
            <q-select outlined dense v-model="cliente.estado_civil_id" :options="estadosCivil" option-value="id"
              :option-label="(estado) =>
                typeof estado === 'object'
                  ? `${estado.id} - ${estado.nome}`
                  : null
                " emit-value map-options placeholder="Selecione o estado civil" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Regime de Casamento</label>
            <q-select outlined dense v-model="cliente.regime_casamento_id" :options="regimesCasamento" option-value="id"
              :option-label="(regime) =>
                typeof regime === 'object'
                  ? `${regime.id} - ${regime.nome}`
                  : ''
                " :disable="campoRegimeCasamento" emit-value map-options placeholder="Selecione o regime" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Data de Casamento</label>
            <q-input type="date" v-model="cliente.data_casamento" :disable="campoDataCasamento" outlined dense>
              <template v-slot:append>
                <q-icon :name="campoDataCasamento ? 'lock' : 'favorite'" :color="campoDataCasamento ? 'grey' : 'red'" />
              </template>
            </q-input>
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Data de Divórcio</label>
            <q-input type="date" v-model="cliente.data_divorcio" :disable="campoDataDivorcio" outlined dense>
              <template v-slot:append>
                <q-icon :name="campoDataDivorcio ? 'lock' : 'gavel'" :color="campoDataDivorcio ? 'grey' : 'blue'" />
              </template>
            </q-input>
          </div>

          <div class="col-md-1 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Código</label>
            <q-input v-model="cliente.conjuge_id" :disable="campoRegimeCasamento" outlined dense />
          </div>

          <div class="col-md-11 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Nome do Cônjuge</label>
            <q-input v-model="cliente.conjuge.nome" :disable="campoRegimeCasamento" outlined dense
              placeholder="Nome completo do cônjuge" />
          </div>

          <div class="col-md-8 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Registro Civil do Casamento</label>
            <q-select outlined dense v-model="cliente.conjuge.nome" :disable="campoRegimeCasamento" emit-value
              map-options placeholder="Selecione o registro">
              <template v-slot:append>
                <q-btn color="primary" icon="add" @click="model = true" flat round size="sm" />
              </template>
            </q-select>
          </div>

          <div class="col-md-2 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Livro</label>
            <q-input outlined dense v-model="cliente.livro" :disable="campoRegimeCasamento" />
          </div>

          <div class="col-md-2 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Folhas</label>
            <q-input outlined dense v-model="cliente.folha" :disable="campoRegimeCasamento" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Filiação -->
    <q-card flat bordered class="mb-3">
      <q-card-section>
        <h6 class="text-primary fw-semibold text-uppercase mb-3 border-bottom pb-2">
          Dados sobre Filiação
        </h6>

        <div class="row q-col-gutter-sm">
          <div class="col-md-5 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Nome da Mãe</label>
            <q-input v-model="cliente.nome_mae" outlined dense placeholder="Nome completo da mãe" />
          </div>

          <div class="col-md-2 col-sm-12 col-xs-12 d-flex align-items-end">
            <q-checkbox v-model="cliente.pai_desconhecido" label="Pai desconhecido" color="primary" />
          </div>

          <div class="col-md-5 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Nome do Pai</label>
            <q-input v-model="cliente.nome_pai" :disable="campoPaiDesconhecido" outlined dense
              placeholder="Nome completo do pai" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Profissão -->
    <q-card flat bordered class="mb-3">
      <q-card-section>
        <h6 class="text-primary fw-semibold text-uppercase mb-3 border-bottom pb-2">
          Dados sobre Profissão
        </h6>

        <div class="row q-col-gutter-sm">
          <div class="col-md-12 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Profissão</label>
            <q-select v-model="cliente.profissao_id" outlined dense placeholder="Selecione a profissão" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Endereço -->
    <q-card flat bordered class="mb-3">
      <q-card-section>
        <h6 class="text-primary fw-semibold text-uppercase mb-3 border-bottom pb-2">
          Endereço
        </h6>

        <div class="row q-col-gutter-sm">
          <div class="col-md-2 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">CEP</label>
            <q-input v-model="cliente.endereco.cep" mask="#####-###" unmasked-value
              @blur="consultarCep(cliente.endereco.cep)" outlined dense placeholder="00000-000" />
          </div>

          <div class="col-md-8 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Endereço</label>
            <q-input v-model="cliente.endereco.logradouro" outlined dense placeholder="Rua, Avenida, etc." />
          </div>

          <div class="col-md-2 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Número</label>
            <q-input v-model="cliente.endereco.numero" outlined dense placeholder="Nº" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Bairro</label>
            <q-input v-model="cliente.endereco.bairro" outlined dense placeholder="Nome do bairro" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Complemento</label>
            <q-input v-model="cliente.endereco.complemento" outlined dense placeholder="Apto, Bloco, etc." />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Estado</label>
            <q-select outlined dense v-model="cliente.estado_id" :options="estados" option-value="id" :option-label="(estado) => `${estado.ibge_codigo} - ${estado.nome}`
              " emit-value map-options @update:model-value="getCidadesPorEstado()" placeholder="Selecione o estado" />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">Cidade</label>
            <q-select outlined dense v-model="cliente.cidade_id" emit-value map-options :options="cidades"
              option-value="id" :option-label="(cidade) => `${cidade.ibge_codigo} - ${cidade.nome}`
                " placeholder="Selecione a cidade" />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <label class="fw-medium text-muted">País</label>
            <q-select outlined dense v-model="cliente.endereco.pais" emit-value map-options
              placeholder="Selecione o país" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <template v-slot:rodape>
      <div class="d-flex justify-content-end gap-3">
        <q-btn label="Cancelar" color="secondary" @click="model = false" outline icon="close" />
        <q-btn label="Salvar" color="primary" icon="check" @click="salvar" />
      </div>
    </template>
  </modal>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRegimesCasamentoStore } from "src/stores/regime-casamento";
import { useClienteStore } from "src/stores/cliente";
import { useEstadoCivilStore } from "src/stores/estado-civil";
import { useTipoPessoaStore } from "src/stores/tipo-pessoa";
import { useEstadoStore } from "src/stores/estado";
import { useCidadeStore } from "src/stores/cidade";
const model = defineModel({ default: false });
import getCep from "src/Utils";
import { useQuasar } from "quasar";

const $q = useQuasar();
const clienteStore = useClienteStore();
const { cliente } = storeToRefs(clienteStore);

const regimesCasamentoStore = useRegimesCasamentoStore();
const { regimesCasamento } = storeToRefs(regimesCasamentoStore);
const campoDataDivorcio = ref(true);
const campoRegimeCasamento = ref(true);
const campoPaiDesconhecido = ref(true);
const campoDataCasamento = ref(true);
const campoNomeDoConjugue = ref(true);

const estadoCivilStore = useEstadoCivilStore();
const { estadoCivil, estadosCivil } = storeToRefs(estadoCivilStore);

const tipoPessoaStore = useTipoPessoaStore();
const { tiposPessoa } = storeToRefs(tipoPessoaStore);

const cidadeStore = useCidadeStore();
const { cidades } = storeToRefs(cidadeStore);

const estadoStore = useEstadoStore();
const { estados } = storeToRefs(estadoStore);

const consultarCep = async (cep) => {
  const response = await getCep(cep);
  cliente.value.endereco = response;
  const cidade = await cidadeStore.getCidadeByCodigoIbge(response.ibge);
  const estado = await estadoStore.getCidadesPorEstado(cidade?.data?.estado_id);
  cliente.value.estado_id = cidade?.data?.estado_id;
  cliente.value.cidade_id = cidade?.data?.id;
};

const salvar = async () => {
  try {
    const response = await clienteStore.create(cliente.value);
    await clienteStore.show(response?.data?.id);

    $q.notify({
      type: "positive",
      message: "Cliente cadastrado com sucesso!",
      position: "top",
      timeout: 2000,
    });
  } catch (e) {
    console.log(e);
  }
};

async function getCidadesPorEstado() {
  cliente.value.cidade_id = null;
  return await estadoStore.getCidadesPorEstado(cliente.value.estado_id);
}

const erroCpfCnpj = ref(false);
const mensagemErroCpfCnpj = ref("");

const mascaraCpfCnpj = computed(() =>
  cliente.value.tipo_pessoa_id === 1 ? "###.###.###-##" : "##.###.###/####-##"
);

function validarCpfCnpj() {
  const valor = cliente.value.cpf_cnpj?.replace(/\D/g, "");
  erroCpfCnpj.value = false;
  mensagemErroCpfCnpj.value = "";

  if (!valor) return;

  if (valor.length === 11 && !validarCPF(valor)) {
    erroCpfCnpj.value = true;
    mensagemErroCpfCnpj.value = "CPF inválido";
  }

  if (valor.length === 14 && !validarCNPJ(valor)) {
    erroCpfCnpj.value = true;
    mensagemErroCpfCnpj.value = "CNPJ inválido";
  }
}

function validarCPF(cpf) {
  if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let dig1 = (soma * 10) % 11;
  if (dig1 === 10) dig1 = 0;
  if (dig1 !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  let dig2 = (soma * 10) % 11;
  if (dig2 === 10) dig2 = 0;
  return dig2 === parseInt(cpf[10]);
}

function validarCNPJ(cnpj) {
  if (!cnpj || cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  let t = cnpj.length - 2,
    d = cnpj.substring(t),
    d1 = parseInt(d.charAt(0)),
    d2 = parseInt(d.charAt(1)),
    calc = (x) => {
      let n = cnpj.substring(0, x),
        y = x - 7,
        s = 0;
      for (let i = x; i >= 1; i--) s += n.charAt(x - i) * y--;
      return ((s * 10) % 11) % 10;
    };
  return calc(t) === d1 && calc(t + 1) === d2;
}

watch(
  () => cliente.value.estado_civil_id,
  (id) => {
    const estado = estadosCivil.value.find((e) => e.id === id);
    const slug = estado?.slug?.toUpperCase() ?? "";

    campoDataCasamento.value = slug !== "CASADO";
    if (campoDataCasamento.value) {
      cliente.value.data_casamento = null;
    }

    campoRegimeCasamento.value = slug !== "CASADO";
    if (campoRegimeCasamento.value) {
      cliente.value.regime_casamento_id = null;
    }

    campoPaiDesconhecido.value = slug !== "SOLTEIRO" && slug !== "VIUVO";
    if (campoPaiDesconhecido.value) {
      cliente.value.pai_desconhecido = null;
    }

    campoNomeDoConjugue.value = slug !== "CASADO";
    if (campoNomeDoConjugue.value) {
      cliente.value.conjuge.nome = null;
    }

    campoDataDivorcio.value = !(slug === "DIVORCIADO" || slug === "SEPARADO");
    if (campoDataDivorcio.value) {
      cliente.value.data_divorcio = null;
    }
  }
);
</script>