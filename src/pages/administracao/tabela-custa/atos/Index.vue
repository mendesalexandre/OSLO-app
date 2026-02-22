<template>
  <q-page padding>

    <!-- Breadcrumb -->
    <q-breadcrumbs class="q-mb-md" active-color="grey-8" separator-color="grey-5">
      <q-breadcrumbs-el icon="fa-duotone fa-house" :to="{ name: 'tarefas' }" />
      <q-breadcrumbs-el label="Administração" to="/administracao" />
      <q-breadcrumbs-el label="Tabelas de Custas" :to="{ name: 'administracao.tabela-custa.index' }" />
      <q-breadcrumbs-el :label="tabela?.nome ?? 'Atos'" />
    </q-breadcrumbs>

    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="oslo-page-title">
          Atos da Tabela
          <span v-if="tabela" class="text-primary q-ml-xs">{{ tabela.ano }}</span>
        </div>
        <div class="oslo-page-subtitle">
          <span v-if="tabela">{{ tabela.nome }}</span>
          <q-skeleton v-else type="text" width="220px" />
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          flat dense no-caps
          icon="fa-regular fa-arrow-left"
          label="Voltar"
          color="grey-7"
          :to="{ name: 'administracao.tabela-custa.index' }"
        />
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="q-py-sm">
        <div class="row q-col-gutter-md items-end">

          <div class="col-12 col-sm-5 col-md-4">
            <v-label label="Buscar ato" />
            <q-input
              v-model="filtros.busca"
              outlined dense clearable placeholder="Código ou nome..."
              @update:model-value="buscarAtosDebounce"
            >
              <template #prepend>
                <q-icon name="fa-regular fa-magnifying-glass" size="14px" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-4 col-md-3">
            <v-label label="Tipo de cálculo" />
            <q-select
              v-model="filtros.tipo_calculo"
              :options="tiposCalculo"
              option-label="label" option-value="value"
              outlined dense clearable emit-value map-options
              @update:model-value="buscarAtos"
            >
              <template #prepend>
                <q-icon name="fa-regular fa-calculator" size="14px" />
              </template>
            </q-select>
          </div>

          <div class="col-auto">
            <q-chip
              :color="totalAtos ? 'primary' : 'grey-4'"
              :text-color="totalAtos ? 'white' : 'grey-7'"
              icon="fa-regular fa-file-lines"
              :label="`${totalAtos} atos`"
              dense
            />
          </div>

        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela de atos -->
    <q-card flat bordered>
      <q-table
        :rows="atos"
        :columns="colunas"
        row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 20, sortBy: 'codigo_ato' }"
        flat
        bordered
        dense
        :no-data-label="loading ? '' : 'Nenhum ato encontrado'"
      >
        <!-- Loading slot -->
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <!-- Código -->
        <template #body-cell-codigo_ato="{ row }">
          <q-td>
            <q-chip dense square color="grey-2" text-color="grey-9" class="text-weight-medium">
              {{ row.codigo_ato }}
            </q-chip>
          </q-td>
        </template>

        <!-- Nome -->
        <template #body-cell-nome="{ row }">
          <q-td style="max-width: 400px; white-space: normal; line-height: 1.3;">
            {{ row.nome }}
          </q-td>
        </template>

        <!-- Tipo de cálculo -->
        <template #body-cell-tipo_calculo="{ row }">
          <q-td>
            <q-badge
              :color="corTipoCalculo(row.tipo_calculo)"
              :label="labelTipoCalculo(row.tipo_calculo)"
              class="text-caption"
            />
          </q-td>
        </template>

        <!-- Valor -->
        <template #body-cell-valor_servico="{ row }">
          <q-td class="text-right text-weight-medium">
            {{ formatCurrency(row.valor_servico) }}
          </q-td>
        </template>

        <!-- Status -->
        <template #body-cell-is_ativo="{ row }">
          <q-td class="text-center">
            <q-icon
              :name="row.is_ativo ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
              :color="row.is_ativo ? 'positive' : 'grey-4'"
              size="16px"
            />
          </q-td>
        </template>

        <!-- Ações -->
        <template #body-cell-acoes="{ row }">
          <q-td class="text-center">
            <q-btn flat dense round icon="fa-regular fa-calculator" color="primary" size="sm" @click="abrirCalculadora(row)">
              <q-tooltip>Calcular emolumento</q-tooltip>
            </q-btn>
            <q-btn flat dense round icon="fa-regular fa-eye" color="grey-7" size="sm" @click="verDetalhes(row)">
              <q-tooltip>Ver detalhes</q-tooltip>
            </q-btn>
          </q-td>
        </template>

      </q-table>
    </q-card>

    <!-- Dialog: Calculadora de Emolumento -->
    <q-dialog v-model="dialogCalculo" persistent>
      <q-card style="min-width: 480px; max-width: 560px">

        <q-card-section class="row items-center q-pb-sm">
          <q-icon name="fa-duotone fa-calculator" color="primary" size="24px" class="q-mr-sm" />
          <div>
            <div class="text-subtitle1 text-weight-semibold">Calculadora de Emolumento</div>
            <div class="text-caption oslo-text-secondary ellipsis">{{ atoSelecionado?.nome }}</div>
          </div>
          <q-space />
          <q-btn flat round dense icon="fa-regular fa-xmark" @click="dialogCalculo = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md">
          <div class="row q-col-gutter-md">

            <div class="col-12">
              <v-label label="Base de cálculo (valor do imóvel/negócio)" />
              <q-input
                v-model.number="calcForm.base_calculo"
                type="number" min="0" step="0.01"
                outlined dense
                prefix="R$"
                :disable="atoSelecionado?.tipo_calculo === 'FIXO'"
                :hint="atoSelecionado?.tipo_calculo === 'FIXO' ? 'Ato de valor fixo — base não é necessária' : ''"
              />
            </div>

            <div class="col-6">
              <v-label label="Quantidade" />
              <q-input v-model.number="calcForm.quantidade" type="number" min="1" max="99" outlined dense />
            </div>

            <div class="col-6 flex items-end">
              <q-btn
                unelevated color="primary" no-caps
                icon="fa-regular fa-calculator"
                label="Calcular"
                class="full-width"
                :loading="calculando"
                @click="calcular"
              />
            </div>

          </div>
        </q-card-section>

        <!-- Resultado -->
        <template v-if="resultado">
          <q-separator />
          <q-card-section class="q-pt-sm">

            <div class="oslo-resultado-header text-caption oslo-text-secondary q-mb-sm">RESULTADO</div>

            <!-- Emolumento bruto -->
            <div class="row items-center justify-between q-py-xs">
              <span class="text-body2">Emolumento bruto</span>
              <span class="text-body2 text-weight-semibold">{{ formatCurrency(resultado.emolumento_bruto) }}</span>
            </div>

            <!-- Impostos -->
            <div
              v-for="imp in resultado.impostos"
              :key="imp.codigo"
              class="row items-center justify-between q-py-xs oslo-imposto-row"
            >
              <div class="row items-center q-gutter-x-xs">
                <q-icon name="fa-regular fa-minus" size="10px" color="negative" />
                <span class="text-caption">{{ imp.nome }}</span>
                <q-badge
                  v-if="imp.percentual"
                  color="grey-3" text-color="grey-8"
                  :label="`${imp.percentual}%`"
                  dense
                />
              </div>
              <span class="text-caption text-negative">- {{ formatCurrency(imp.valor) }}</span>
            </div>

            <q-separator class="q-my-sm" />

            <!-- Emolumento líquido -->
            <div class="row items-center justify-between q-py-xs">
              <span class="text-body2 oslo-text-secondary">Emolumento líquido (cartório)</span>
              <span class="text-body2">{{ formatCurrency(resultado.emolumento_liquido) }}</span>
            </div>

            <!-- Total cliente -->
            <div class="row items-center justify-between q-py-xs bg-primary-subtle rounded-borders q-px-sm q-mt-xs">
              <span class="text-body1 text-weight-bold">Total do cliente</span>
              <span class="text-body1 text-weight-bold text-primary">{{ formatCurrency(resultado.total_cliente) }}</span>
            </div>

          </q-card-section>
        </template>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, debounce } from 'quasar'
import { api } from 'src/boot/axios'

defineOptions({ name: 'TabelaCustaAtosIndex' })

const props = defineProps({
  tabelaCustaId: { type: [String, Number], required: true },
})

const $q = useQuasar()

// ── Estado ────────────────────────────────────────────────────────────────────
const loading    = ref(false)
const tabela     = ref(null)
const atos       = ref([])
const totalAtos  = computed(() => atos.value.length)

// ── Calculadora ───────────────────────────────────────────────────────────────
const dialogCalculo   = ref(false)
const calculando      = ref(false)
const atoSelecionado  = ref(null)
const resultado       = ref(null)
const calcForm        = ref({ base_calculo: 0, quantidade: 1 })

// ── Filtros ───────────────────────────────────────────────────────────────────
const tiposCalculo = [
  { label: 'Fixo',               value: 'FIXO'              },
  { label: 'Faixa Progressiva',  value: 'FAIXA_PROGRESSIVA' },
  { label: 'Gratuito',           value: 'GRATUITO'          },
]

const filtros = ref({ busca: '', tipo_calculo: null })

// ── Colunas da tabela ─────────────────────────────────────────────────────────
const colunas = [
  { name: 'codigo_ato',    label: 'Código', field: 'codigo_ato',   align: 'center', sortable: true, style: 'width: 80px' },
  { name: 'nome',          label: 'Nome do Ato', field: 'nome',    align: 'left',   sortable: true },
  { name: 'tipo_calculo',  label: 'Tipo',   field: 'tipo_calculo', align: 'center', sortable: true },
  { name: 'valor_servico', label: 'Valor',  field: 'valor_servico',align: 'right',  sortable: true },
  { name: 'is_ativo',      label: 'Ativo',  field: 'is_ativo',     align: 'center', sortable: false, style: 'width: 60px' },
  { name: 'acoes',         label: '',       field: 'acoes',        align: 'center', sortable: false, style: 'width: 80px' },
]

// ── API ───────────────────────────────────────────────────────────────────────
const carregarTabela = async () => {
  try {
    const { data } = await api.get(`/tabela-custa/${props.tabelaCustaId}`)
    tabela.value = data.dados ?? data
  } catch (e) {
    console.error('Erro ao carregar tabela:', e)
  }
}

const buscarAtos = async () => {
  loading.value = true
  try {
    const params = { tabela_custa_id: props.tabelaCustaId }
    if (filtros.value.busca)        params.busca        = filtros.value.busca
    if (filtros.value.tipo_calculo) params.tipo_calculo = filtros.value.tipo_calculo

    const { data } = await api.get('/tabela-custa-ato', { params })
    atos.value = data.dados ?? data
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar atos', caption: e.response?.data?.mensagem })
  } finally {
    loading.value = false
  }
}

const buscarAtosDebounce = debounce(buscarAtos, 400)

const calcular = async () => {
  if (!atoSelecionado.value) return
  calculando.value = true
  resultado.value  = null
  try {
    const { data } = await api.post(
      `/tabela-custa-ato/${atoSelecionado.value.uuid}/calcular`,
      calcForm.value,
    )
    resultado.value = data.dados ?? data
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao calcular', caption: e.response?.data?.mensagem })
  } finally {
    calculando.value = false
  }
}

// ── Ações ─────────────────────────────────────────────────────────────────────
const abrirCalculadora = (ato) => {
  atoSelecionado.value = ato
  resultado.value      = null
  calcForm.value       = { base_calculo: 0, quantidade: 1 }
  dialogCalculo.value  = true
}

const verDetalhes = (ato) => {
  $q.dialog({
    title: `Ato ${ato.codigo_ato}`,
    message: ato.descricao || ato.nome,
    ok: { label: 'Fechar', flat: true },
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const labelTipoCalculo = (tipo) => ({
  FIXO:              'Fixo',
  FAIXA_PROGRESSIVA: 'Progressivo',
  GRATUITO:          'Gratuito',
}[tipo] ?? tipo)

const corTipoCalculo = (tipo) => ({
  FIXO:              'blue-2',
  FAIXA_PROGRESSIVA: 'orange-2',
  GRATUITO:          'green-2',
}[tipo] ?? 'grey-3')

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  carregarTabela()
  buscarAtos()
})
</script>

<style lang="scss" scoped>
.oslo-imposto-row {
  border-left: 2px solid #fee2e2;
  padding-left: 8px;
  margin-left: 4px;
  margin-bottom: 2px;
}

.oslo-resultado-header {
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.bg-primary-subtle {
  background: rgba(var(--q-primary-rgb, 255, 122, 0), 0.08);
  border-radius: 6px;
}
</style>
