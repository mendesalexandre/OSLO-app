<template>
  <modal titulo="Cadastrar novo Indicador" v-model="model" tamanho="lg">
    <!-- Dados Pessoais -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-1 col-sm-12 col-xs-12">
            <v-label label="ID" />
            <q-input v-model="indicadorPessoal.id" outlined dense disabled />
          </div>

          <div class="col-md-8 col-sm-12 col-xs-12">
            <v-label label="Nome" obrigatorio />
            <q-input v-model="indicadorPessoal.nome" outlined dense placeholder="Nome completo" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-input-check v-model="indicadorPessoal.ativo" label="Ativo?" />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <v-label label="Tipo Pessoa" obrigatorio />
            <q-select v-model="indicadorPessoal.tipo_pessoa_id" outlined dense :options="tiposPessoa" option-value="id"
              :option-label="(tipo) => `${tipo.id} - ${tipo.nome}`" emit-value map-options
              placeholder="Selecione o tipo" />
          </div>

          <div class="col-md-5 col-sm-12 col-xs-12">
            <v-label label="CPF/CNPJ" obrigatorio />
            <q-input v-model="indicadorPessoal.cpf_cnpj" :mask="mascaraCpfCnpj" unmasked-value outlined dense
              @blur="validarCpfCnpj" :error="erroCpfCnpj" :error-message="mensagemErroCpfCnpj"
              placeholder="Digite o CPF ou CNPJ" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-label label="Data de Nascimento" />
            <q-input v-model="indicadorPessoal.data_nascimento" type="date" outlined dense />
          </div>

          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-label label="E-mail" />
            <q-input v-model="indicadorPessoal.email" outlined dense type="email" placeholder="exemplo@email.com" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-label label="Passaporte" />
            <q-input v-model="indicadorPessoal.passaporte" outlined dense placeholder="Número do passaporte" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-label label="RG" />
            <q-input v-model="indicadorPessoal.rg" outlined dense placeholder="Registro Geral" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-label label="CNH" />
            <q-input v-model="indicadorPessoal.cnh" outlined dense placeholder="Carteira de Habilitação" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-label label="Identidade Profissional" />
            <q-input v-model="indicadorPessoal.identidade_profissional" outlined dense
              placeholder="Registro profissional" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- SISCOAF -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">Informações SISCOAF</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check v-model="indicadorPessoal.pessoa_falecida" label="Pessoa Falecida" />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check v-model="indicadorPessoal.menor_idade" label="Menor de Idade" />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check v-model="indicadorPessoal.incapaz" label="Incapaz" />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check v-model="indicadorPessoal.pessoa_politicamente_exposta"
              label="Pessoa Politicamente Exposta" />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check v-model="indicadorPessoal.servidor_publico" label="Servidor Público" />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check v-model="indicadorPessoal.pessoa_obrigada" label="Pessoa Obrigada" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dados de Contato -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">Dados de Contato</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Telefone" />
            <q-input v-model="indicadorPessoal.telefone" mask="(##) ####-####" unmasked-value outlined dense
              placeholder="(11) 1234-5678" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Celular" />
            <q-input v-model="indicadorPessoal.celular" mask="(##) #####-####" unmasked-value outlined dense
              placeholder="(11) 99999-9999" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Estado Civil -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">Estado Civil</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Estado Civil" />
            <q-select v-model="indicadorPessoal.estado_civil_id" outlined dense :options="[]" option-value="id"
              :option-label="(estado) =>
                typeof estado === 'object' ? `${estado.id} - ${estado.nome}` : null
                " emit-value map-options placeholder="Selecione o estado civil" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Regime de Casamento" />
            <q-select v-model="indicadorPessoal.regime_casamento_id" outlined dense :options="[]" option-value="id"
              :option-label="(regime) =>
                typeof regime === 'object' ? `${regime.id} - ${regime.nome}` : ''
                " :disable="campoRegimeCasamento" emit-value map-options placeholder="Selecione o regime" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Data de Casamento" />
            <q-input v-model="indicadorPessoal.data_casamento" type="date" :disable="campoDataCasamento" outlined dense>
              <template v-slot:append>
                <q-icon :name="campoDataCasamento ? 'lock' : 'favorite'" :color="campoDataCasamento ? 'grey' : 'red'" />
              </template>
            </q-input>
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Data de Divórcio" />
            <q-input v-model="indicadorPessoal.data_divorcio" type="date" :disable="campoDataDivorcio" outlined dense>
              <template v-slot:append>
                <q-icon :name="campoDataDivorcio ? 'lock' : 'gavel'" :color="campoDataDivorcio ? 'grey' : 'blue'" />
              </template>
            </q-input>
          </div>

          <div class="col-md-1 col-sm-12 col-xs-12">
            <v-label label="Código" />
            <q-input v-model="indicadorPessoal.conjuge.codigo" :disable="campoRegimeCasamento" outlined dense />
          </div>

          <div class="col-md-11 col-sm-12 col-xs-12">
            <v-label label="Nome do Cônjuge" />
            <q-input v-model="indicadorPessoal.conjuge.nome" :disable="campoRegimeCasamento" outlined dense
              placeholder="Nome completo do cônjuge" />
          </div>

          <div class="col-md-8 col-sm-12 col-xs-12">
            <v-label label="Registro Civil do Casamento" />
            <q-select v-model="indicadorPessoal.conjuge.registro_civil_id" outlined dense
              :disable="campoRegimeCasamento" emit-value map-options placeholder="Selecione o registro">
              <template v-slot:append>
                <q-btn color="primary" icon="add" @click="abrirModalRegistro" flat round size="sm" />
              </template>
            </q-select>
          </div>

          <div class="col-md-2 col-sm-12 col-xs-12">
            <v-label label="Livro" />
            <q-input v-model="indicadorPessoal.conjuge.livro" outlined dense :disable="campoRegimeCasamento" />
          </div>

          <div class="col-md-2 col-sm-12 col-xs-12">
            <v-label label="Folhas" />
            <q-input v-model="indicadorPessoal.conjuge.folhas" outlined dense :disable="campoRegimeCasamento" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Filiação -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">Dados sobre Filiação</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-label label="Nome da Mãe" />
            <q-input v-model="indicadorPessoal.nome_mae" outlined dense placeholder="Nome completo da mãe" />
          </div>

          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-input-check v-model="indicadorPessoal.pai_desconhecido" label="Pai desconhecido" />
          </div>

          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-label label="Nome do Pai" />
            <q-input v-model="indicadorPessoal.nome_pai" :disable="indicadorPessoal.pai_desconhecido" outlined dense
              placeholder="Nome completo do pai" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Profissão -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">Dados sobre Profissão</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-label label="Profissão" />
            <q-select v-model="indicadorPessoal.profissao_id" outlined dense placeholder="Selecione a profissão" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Endereço -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">Endereço</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-2 col-sm-12 col-xs-12">
            <v-label label="CEP" />
            <q-input v-model="indicadorPessoal.endereco.cep" mask="#####-###" unmasked-value @blur="consultarCep"
              outlined dense placeholder="00000-000" />
          </div>

          <div class="col-md-8 col-sm-12 col-xs-12">
            <v-label label="Endereço" />
            <q-input v-model="indicadorPessoal.endereco.logradouro" outlined dense placeholder="Rua, Avenida, etc." />
          </div>

          <div class="col-md-2 col-sm-12 col-xs-12">
            <v-label label="Número" />
            <q-input v-model="indicadorPessoal.endereco.numero" outlined dense placeholder="Nº" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Bairro" />
            <q-input v-model="indicadorPessoal.endereco.bairro" outlined dense placeholder="Nome do bairro" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Complemento" />
            <q-input v-model="indicadorPessoal.endereco.complemento" outlined dense placeholder="Apto, Bloco, etc." />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <v-label label="Estado" />
            <q-select v-model="indicadorPessoal.endereco.estado_id" outlined dense :options="estados" option-value="id"
              :option-label="(estado) => `${estado.ibge_codigo} - ${estado.nome}`" emit-value map-options
              @update:model-value="getCidadesPorEstado" placeholder="Selecione o estado" />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <v-label label="Cidade" />
            <q-select v-model="indicadorPessoal.endereco.cidade_id" outlined dense emit-value map-options
              :options="cidades" option-value="id" :option-label="(cidade) => `${cidade.ibge_codigo} - ${cidade.nome}`"
              placeholder="Selecione a cidade" />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <v-label label="País" />
            <q-select v-model="indicadorPessoal.endereco.pais_id" outlined dense emit-value map-options
              placeholder="Selecione o país" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <template v-slot:rodape>
      <q-card-section class="flex justify-end">
        <div class="q-gutter-sm">
          <q-btn label="Cancelar" color="secondary" @click="cancelar" outline icon="close" />
          <q-btn label="Salvar" color="primary" icon="check" @click="salvar" />
        </div>
      </q-card-section>
    </template>
  </modal>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useIndicadorPessoal } from "src/stores/indicador-pessoal";
import { useEstadoStore } from "src/stores/estado";
import getCep from "src/Utils";
import { useQuasar } from "quasar";

const model = defineModel({ default: false });
const $q = useQuasar();

// Store
const indicadorPessoalStore = useIndicadorPessoal();
const { indicadorPessoal } = storeToRefs(indicadorPessoalStore);

// Estados e Cidades (implementar conforme sua lógica)
const estados = ref([]);
const cidades = ref([]);
const tiposPessoa = ref([]);

// Controles de campos desabilitados
const campoDataDivorcio = ref(true);
const campoRegimeCasamento = ref(true);
const campoDataCasamento = ref(true);

// Validação CPF/CNPJ
const erroCpfCnpj = ref(false);
const mensagemErroCpfCnpj = ref("");

// Computed
const mascaraCpfCnpj = computed(() => indicadorPessoalStore.mascaraCpfCnpj);

// Métodos
const consultarCep = async () => {
  if (!indicadorPessoal.value.endereco.cep) return;

  try {
    const response = await getCep(indicadorPessoal.value.endereco.cep);
    indicadorPessoalStore.preencherEnderecoCep(response);
  } catch (error) {
    console.error("Erro ao consultar CEP:", error);
  }
};

const getCidadesPorEstado = async () => {
  indicadorPessoal.value.endereco.cidade_id = null;
  // Implementar lógica de busca de cidades
};

const validarCpfCnpj = () => {
  // Implementar validação
  erroCpfCnpj.value = false;
  mensagemErroCpfCnpj.value = "";
};

const abrirModalRegistro = () => {
  // Implementar abertura de modal
};

const salvar = async () => {
  try {
    await indicadorPessoalStore.salvar();

    $q.notify({
      type: "positive",
      message: "Indicador cadastrado com sucesso!",
      position: "top",
      timeout: 2000,
    });

    model.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao salvar indicador",
      position: "top",
      timeout: 2000,
    });
  }
};

const cancelar = () => {
  indicadorPessoalStore.resetarFormulario();
  model.value = false;
};
</script>