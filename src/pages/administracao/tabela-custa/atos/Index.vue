<template>
  <q-page padding>

    <!-- Breadcrumb -->
    <q-breadcrumbs class="q-mb-md" active-color="grey-8" separator-color="grey-5">
      <q-breadcrumbs-el :to="{ name: 'tarefas' }"><l-icon name="home" :size="14" /></q-breadcrumbs-el>
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
        <q-btn flat dense no-caps color="grey-7"
          :to="{ name: 'administracao.tabela-custa.index' }">
          <l-icon name="arrow-left" :size="16" class="q-mr-xs" />
          Voltar
        </q-btn>
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="q-py-sm">
        <div class="row q-col-gutter-md items-end">

          <div class="col-12 col-sm-5 col-md-4">
            <v-label label="Buscar ato" />
            <q-input v-model="filtros.busca" outlined dense clearable placeholder="Código ou nome..."
              @update:model-value="buscarAtosDebounce">
              <template #prepend>
                <l-icon name="search" :size="14" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-4 col-md-3">
            <v-label label="Tipo de cálculo" />
            <q-select v-model="filtros.tipo_calculo" :options="tiposCalculo" option-label="label" option-value="value"
              outlined dense clearable emit-value map-options @update:model-value="buscarAtos">
              <template #prepend>
                <l-icon name="calculator" :size="14" />
              </template>
            </q-select>
          </div>

          <div class="col-auto">
            <q-chip :color="totalAtos ? 'primary' : 'grey-4'" :text-color="totalAtos ? 'white' : 'grey-7'"
              :label="`${totalAtos} atos`" dense />
          </div>

        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela de atos -->
    <q-card flat bordered>
      <q-table :rows="atos" :columns="colunas" row-key="id" :loading="loading"
        :pagination="{ rowsPerPage: 20, sortBy: 'codigo_ato' }" flat bordered dense
        :no-data-label="loading ? '' : 'Nenhum ato encontrado'">
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template #body-cell-codigo_ato="{ row }">
          <q-td>
            <q-chip dense square color="grey-2" text-color="grey-9" class="text-weight-medium">
              {{ row.codigo_ato }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-nome="{ row }">
          <q-td style="max-width: 400px; white-space: normal; line-height: 1.3;">
            {{ row.nome }}
          </q-td>
        </template>

        <template #body-cell-tipo_calculo="{ row }">
          <q-td>
            <q-badge :color="corTipoCalculo(row.tipo_calculo)" :label="labelTipoCalculo(row.tipo_calculo)"
              class="text-caption" />
          </q-td>
        </template>

        <template #body-cell-valor_servico="{ row }">
          <q-td class="text-right text-weight-medium">
            {{ formatCurrency(row.valor_servico) }}
          </q-td>
        </template>

        <template #body-cell-is_ativo="{ row }">
          <q-td class="text-center">
            <l-icon
              :name="row.is_ativo ? 'circle-check' : 'circle-x'"
              :size="16"
              :color="row.is_ativo ? 'var(--success)' : '#bdbdbd'"
            />
          </q-td>
        </template>

        <template #body-cell-acoes="{ row }">
          <q-td class="text-center">
            <q-btn flat dense round color="primary" size="sm"
              @click="abrirCalculadora(row)">
              <l-icon name="calculator" :size="16" />
              <q-tooltip>Calcular emolumento</q-tooltip>
            </q-btn>
            <q-btn flat dense round color="grey-7" size="sm"
              @click="abrirEdicao(row)">
              <l-icon name="pen" :size="16" />
              <q-tooltip>Editar ato</q-tooltip>
            </q-btn>
          </q-td>
        </template>

      </q-table>
    </q-card>

    <!-- Modais -->
    <modal-tabela-custa-ato-calcular v-model="dialogCalculo" :ato="atoSelecionado" />

    <modal-tabela-custa-ato v-model="dialogEdicao" :ato="atoSelecionado" @salvo="onAtoSalvo" />

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, debounce } from 'quasar'
import { api } from 'src/boot/axios'
import ModalTabelaCustaAto from 'src/components/tabela-custa/ModalTabelaCustaAto.vue'
import ModalTabelaCustaAtoCalcular from 'src/components/tabela-custa/ModalTabelaCustaAtoCalcular.vue'
import { useTabelaCustaAto } from 'src/stores/tabela-custa-ato'

defineOptions({ name: 'TabelaCustaAtosIndex' })

const props = defineProps({
  tabelaCustaId: { type: [String, Number], required: true },
})

const $q                 = useQuasar()
const tabelaCustaAtoStore = useTabelaCustaAto()

// ── Estado ────────────────────────────────────────────────────────────────────
const loading        = ref(false)
const tabela         = ref(null)
const atos           = ref([])
const atoSelecionado = ref(null)
const totalAtos      = computed(() => atos.value.length)

// ── Modais ────────────────────────────────────────────────────────────────────
const dialogCalculo = ref(false)
const dialogEdicao  = ref(false)

// ── Filtros ───────────────────────────────────────────────────────────────────
const tiposCalculo = [
  { label: 'Fixo',              value: 'FIXO'              },
  { label: 'Faixa Progressiva', value: 'FAIXA_PROGRESSIVA' },
  { label: 'Gratuito',          value: 'GRATUITO'          },
]

const filtros = ref({ busca: '', tipo_calculo: null })

// ── Colunas ───────────────────────────────────────────────────────────────────
const colunas = [
  { name: 'codigo_ato',    label: 'Código',      field: 'codigo_ato',    align: 'center', sortable: true,  style: 'width: 80px' },
  { name: 'nome',          label: 'Nome do Ato', field: 'nome',          align: 'left',   sortable: true                        },
  { name: 'tipo_calculo',  label: 'Tipo',        field: 'tipo_calculo',  align: 'center', sortable: true                        },
  { name: 'valor_servico', label: 'Valor',       field: 'valor_servico', align: 'right',  sortable: true                        },
  { name: 'is_ativo',      label: 'Ativo',       field: 'is_ativo',      align: 'center', sortable: false, style: 'width: 60px' },
  { name: 'acoes',         label: '',            field: 'acoes',         align: 'center', sortable: false, style: 'width: 90px' },
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

    atos.value = await tabelaCustaAtoStore.listar(params)
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar atos', caption: e.response?.data?.mensagem })
  } finally {
    loading.value = false
  }
}

const buscarAtosDebounce = debounce(buscarAtos, 400)

// ── Ações ─────────────────────────────────────────────────────────────────────
const abrirCalculadora = (row) => {
  atoSelecionado.value = row
  dialogCalculo.value  = true
}

const abrirEdicao = async (row) => {
  atoSelecionado.value = await tabelaCustaAtoStore.buscar(row.uuid)
  dialogEdicao.value   = true
}

const onAtoSalvo = (atualizado) => {
  const idx = atos.value.findIndex(a => a.uuid === atualizado.uuid)
  if (idx !== -1) atos.value.splice(idx, 1, atualizado)
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const labelTipoCalculo = (tipo) => ({
  FIXO: 'Fixo',
  FAIXA_PROGRESSIVA: 'Progressivo',
  GRATUITO: 'Gratuito',
}[tipo] ?? tipo)

const corTipoCalculo = (tipo) => ({
  FIXO: 'blue-2',
  FAIXA_PROGRESSIVA: 'orange-2',
  GRATUITO: 'green-2',
}[tipo] ?? 'grey-3')

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  carregarTabela()
  buscarAtos()
})
</script>