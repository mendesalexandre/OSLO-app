<template>
  <modal titulo="Cadastrar novo Indicador" v-model="model" tamanho="lg">
    <!-- Dados Pessoais -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-1 col-sm-12 col-xs-12">
            <v-label label="ID" />
            <q-input outlined dense disabled />
          </div>

          <div class="col-md-8 col-sm-12 col-xs-12">
            <v-label label="Nome" obrigatorio />
            <q-input outlined dense placeholder="Nome completo" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-input-check label="Ativo?" obrigatorio />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <v-label label="Tipo Pessoa" obrigatorio />
            <q-select outlined dense :options="tiposPessoa" option-value="id"
              :option-label="(tipo) => `${tipo.id} - ${tipo.nome}`" emit-value map-options
              placeholder="Selecione o tipo" />
          </div>

          <div class="col-md-5 col-sm-12 col-xs-12">
            <v-label label="CPF/CNPJ" obrigatorio />
            <q-input :mask="mascaraCpfCnpj" unmasked-value outlined dense @blur="validarCpfCnpj" :error="erroCpfCnpj"
              :error-message="mensagemErroCpfCnpj" placeholder="Digite o CPF ou CNPJ" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-label label="Data de Nascimento" />
            <q-input type="date" outlined dense />
          </div>

          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-label label="E-mail" />
            <q-input outlined dense type="email" placeholder="exemplo@email.com" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-label label="Passaporte" />
            <q-input outlined dense placeholder="Número do passaporte" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-label label="RG" />
            <q-input outlined dense placeholder="Registro Geral" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-label label="CNH" />
            <q-input outlined dense placeholder="Carteira de Habilitação" />
          </div>

          <div class="col-md-3 col-sm-12 col-xs-12">
            <v-label label="Identidade Profissional" />
            <q-input outlined dense placeholder="Registro profissional" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- SISCOAF -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">
          Informações SISCOAF
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-md-4 col-sm-6 col-xs-12">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <v-input-check label="Pessoa Falecida" obrigatorio />
            </div>
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check label="Menor de Idade" obrigatorio />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check label="Incapaz" obrigatorio />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check label="Pessoa Politicamente Exposta" obrigatorio />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check label="Servidor Público" obrigatorio />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <v-input-check label="Pessoa Obrigada" obrigatorio />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dados de Contato -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">
          Dados de Contato
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Telefone" />
            <q-input mask="(##) ####-####" unmasked-value outlined dense placeholder="(11) 1234-5678" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Celular" />
            <q-input mask="(##) #####-####" unmasked-value outlined dense placeholder="(11) 99999-9999" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Estado Civil -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">
          Estado Civil
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Estado Civil" />
            <q-select outlined dense :options="[]" option-value="id" :option-label="(estado) =>
              typeof estado === 'object'
                ? `${estado.id} - ${estado.nome}`
                : null
              " emit-value map-options placeholder="Selecione o estado civil" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Regime de Casamento" />
            <q-select outlined dense :options="[]" option-value="id" :option-label="(regime) =>
              typeof regime === 'object'
                ? `${regime.id} - ${regime.nome}`
                : ''
              " :disable="campoRegimeCasamento" emit-value map-options placeholder="Selecione o regime" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Data de Casamento" />
            <q-input type="date" :disable="campoDataCasamento" outlined dense>
              <template v-slot:append>
                <q-icon :name="campoDataCasamento ? 'lock' : 'favorite'" :color="campoDataCasamento ? 'grey' : 'red'" />
              </template>
            </q-input>
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Data de Divórcio" />
            <q-input type="date" :disable="campoDataDivorcio" outlined dense>
              <template v-slot:append>
                <q-icon :name="campoDataDivorcio ? 'lock' : 'gavel'" :color="campoDataDivorcio ? 'grey' : 'blue'" />
              </template>
            </q-input>
          </div>

          <div class="col-md-1 col-sm-12 col-xs-12">
            <v-label label="Código" />
            <q-input :disable="campoRegimeCasamento" outlined dense />
          </div>

          <div class="col-md-11 col-sm-12 col-xs-12">
            <v-label label="Nome do Cônjuge" />
            <q-input :disable="campoRegimeCasamento" outlined dense placeholder="Nome completo do cônjuge" />
          </div>

          <div class="col-md-8 col-sm-12 col-xs-12">
            <v-label label="Registro Civil do Casamento" />
            <q-select outlined dense :disable="campoRegimeCasamento" emit-value map-options
              placeholder="Selecione o registro">
              <template v-slot:append>
                <q-btn color="primary" icon="add" @click="model = true" flat round size="sm" />
              </template>
            </q-select>
          </div>

          <div class="col-md-2 col-sm-12 col-xs-12">
            <v-label label="Livro" />
            <q-input outlined dense :disable="campoRegimeCasamento" />
          </div>

          <div class="col-md-2 col-sm-12 col-xs-12">
            <v-label label="Folhas" />
            <q-input outlined dense :disable="campoRegimeCasamento" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Filiação -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">
          Dados sobre Filiação
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-label label="Nome da Mãe" />
            <q-input outlined dense placeholder="Nome completo da mãe" />
          </div>

          <div class="col-md-12 col-sm-12 col-xs-12 ">
            <v-input-check label="Pai desconhecido" obrigatorio />
          </div>

          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-label label="Nome do Pai" />
            <q-input :disable="campoPaiDesconhecido" outlined dense placeholder="Nome completo do pai" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Profissão -->
    <q-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="titulo">
          Dados sobre Profissão
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>

        <div class="row q-col-gutter-sm">
          <div class="col-md-12 col-sm-12 col-xs-12">
            <v-label label="Profissão" />
            <q-select outlined dense placeholder="Selecione a profissão" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Endereço -->
    <q-card flat bordered class="q-mb-sm">

      <q-card-section>
        <div class="titulo">
          Endereço
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-md-2 col-sm-12 col-xs-12">
            <v-label label="CEP" />
            <q-input mask="#####-###" unmasked-value @blur="consultarCep(cliente.endereco.cep)" outlined dense
              placeholder="00000-000" />
          </div>

          <div class="col-md-8 col-sm-12 col-xs-12">
            <v-label label="Endereço" />
            <q-input outlined dense placeholder="Rua, Avenida, etc." />
          </div>

          <div class="col-md-2 col-sm-12 col-xs-12">
            <v-label label="Número" />
            <q-input outlined dense placeholder="Nº" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Bairro" />
            <q-input outlined dense placeholder="Nome do bairro" />
          </div>

          <div class="col-md-6 col-sm-12 col-xs-12">
            <v-label label="Complemento" />
            <q-input outlined dense placeholder="Apto, Bloco, etc." />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <v-label label="Estado" />
            <q-select outlined dense :options="estados" option-value="id"
              :option-label="(estado) => `${estado.ibge_codigo} - ${estado.nome}`" emit-value map-options
              @update:model-value="getCidadesPorEstado()" placeholder="Selecione o estado" />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <v-label label="Cidade" />
            <q-select outlined dense emit-value map-options :options="cidades" option-value="id"
              :option-label="(cidade) => `${cidade.ibge_codigo} - ${cidade.nome}`" placeholder="Selecione a cidade" />
          </div>

          <div class="col-md-4 col-sm-12 col-xs-12">
            <v-label label="País" />
            <q-select outlined dense emit-value map-options placeholder="Selecione o país" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <template v-slot:rodape>
      <q-card-section class="flex justify-end">
        <div class="q-gutter-sm q-mr-md">
          <q-btn label="Cancelar" color="secondary" @click="model = false" outline icon="close" />
          <q-btn label="Salvar" color="primary" icon="check" @click="salvar" />
        </div>
      </q-card-section>
    </template>
  </modal>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useIndicadorPessoal } from "src/stores/indicador-pessoal";
import { useEstadoStore } from "src/stores/estado";
import getCep from "src/Utils";
import { useQuasar } from "quasar";

const model = defineModel({ default: false });
const $q = useQuasar();

const campoDataDivorcio = ref(true);
const campoRegimeCasamento = ref(true);
const campoPaiDesconhecido = ref(true);
const campoDataCasamento = ref(true);
const campoNomeDoConjugue = ref(true);

const indicadorPessoalStore = useIndicadorPessoal();
const { indicadorPessoal } = storeToRefs(indicadorPessoalStore);

const erroCpfCnpj = ref(false);
const mensagemErroCpfCnpj = ref("");

const mascaraCpfCnpj = computed(() =>
  indicadorPessoal.value.tipo_pessoa_id === 1 ? "###.###.###-##" : "##.###.###/####-##"
);
</script>

<style scoped>
.mb-3 {
  margin-bottom: 1rem;
}

.gap-3 {
  gap: 1rem;
}
</style>