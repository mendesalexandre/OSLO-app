<template>
  <q-page padding>

    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="oslo-page-title">Tabelas de Custas</div>
        <div class="oslo-page-subtitle">Gerencie as tabelas de custas cartoriais por ano</div>
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="q-py-sm">
        <div class="row q-col-gutter-md items-end">

          <div class="col-12 col-sm-4 col-md-3">
            <v-label label="Ano" />
            <q-select
              v-model="filtros.ano"
              :options="anosDisponiveis"
              outlined dense clearable emit-value map-options
              @update:model-value="buscarTabelas"
            >
              <template #prepend>
                <q-icon name="fa-regular fa-calendar" size="14px" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-4 col-md-3">
            <v-label label="Status" />
            <q-select
              v-model="filtros.is_ativo"
              :options="statusOptions"
              option-label="label" option-value="value"
              outlined dense clearable emit-value map-options
              @update:model-value="buscarTabelas"
            >
              <template #prepend>
                <q-icon name="fa-regular fa-circle-check" size="14px" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-4 col-md-4">
            <v-label label="Buscar" />
            <q-input
              v-model="filtros.busca"
              outlined dense clearable placeholder="Nome da tabela..."
              @update:model-value="buscarTabelasDebounce"
            >
              <template #prepend>
                <q-icon name="fa-regular fa-magnifying-glass" size="14px" />
              </template>
            </q-input>
          </div>

          <div class="col-auto">
            <q-btn
              flat dense
              icon="fa-regular fa-arrows-rotate"
              color="grey-7"
              @click="buscarTabelas"
            >
              <q-tooltip>Atualizar</q-tooltip>
            </q-btn>
          </div>

        </div>
      </q-card-section>
    </q-card>

    <!-- Loading -->
    <div v-if="loading" class="row justify-center q-py-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <!-- Sem dados -->
    <q-card v-else-if="!tabelas.length" flat bordered>
      <q-card-section class="text-center q-py-xl">
        <q-icon name="fa-duotone fa-table-list" size="56px" color="grey-5" class="q-mb-md" />
        <div class="text-h6 oslo-text-secondary">Nenhuma tabela encontrada</div>
        <div class="text-caption text-grey-6 q-mt-xs">
          Ajuste os filtros ou execute os seeders para popular os dados
        </div>
      </q-card-section>
    </q-card>

    <!-- Lista de Tabelas -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="tabela in tabelas"
        :key="tabela.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat bordered class="oslo-tabela-card">

          <!-- Topo do card -->
          <q-card-section class="q-pb-sm">
            <div class="row items-start no-wrap">
              <div class="col">
                <div class="text-subtitle1 text-weight-semibold ellipsis-2-lines">
                  {{ tabela.nome }}
                </div>
              </div>
              <q-badge
                :color="tabela.is_ativo ? 'positive' : 'grey-5'"
                :label="tabela.is_ativo ? 'Ativa' : 'Inativa'"
                class="q-ml-sm"
              />
            </div>
          </q-card-section>

          <q-separator />

          <!-- Dados da tabela -->
          <q-card-section class="q-py-sm">
            <div class="row q-col-gutter-xs">

              <div class="col-6">
                <div class="row items-center q-gutter-x-xs text-caption oslo-text-secondary">
                  <q-icon name="fa-regular fa-calendar" size="12px" />
                  <span>Ano</span>
                </div>
                <div class="text-weight-semibold text-h6 text-primary">{{ tabela.ano }}</div>
              </div>

              <div class="col-6">
                <div class="row items-center q-gutter-x-xs text-caption oslo-text-secondary">
                  <q-icon name="fa-regular fa-file-lines" size="12px" />
                  <span>Atos</span>
                </div>
                <div class="text-weight-semibold text-h6">{{ tabela.atos_count ?? 0 }}</div>
              </div>

              <div class="col-6 q-mt-xs">
                <div class="text-caption oslo-text-secondary">Vigência início</div>
                <div class="text-caption text-weight-medium">{{ formatDate(tabela.vigencia_inicio) }}</div>
              </div>

              <div class="col-6 q-mt-xs">
                <div class="text-caption oslo-text-secondary">Vigência fim</div>
                <div class="text-caption text-weight-medium">
                  {{ tabela.vigencia_fim ? formatDate(tabela.vigencia_fim) : 'Indeterminado' }}
                </div>
              </div>

            </div>
          </q-card-section>

          <q-separator />

          <!-- Ações -->
          <q-card-actions class="q-px-md q-py-xs">
            <q-btn
              flat dense no-caps
              icon="fa-regular fa-list"
              label="Ver Atos"
              color="primary"
              @click="abrirAtos(tabela)"
            />
            <q-space />
            <q-btn flat dense round icon="fa-regular fa-pen-to-square" color="grey-7" @click.stop="abrirFormulario(tabela)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
          </q-card-actions>

        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, debounce, date } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

defineOptions({ name: 'TabelaCustaIndex' })

const $q    = useQuasar()
const router = useRouter()

// ── Estado ──────────────────────────────────────────────────────────────────
const loading           = ref(false)
const tabelas           = ref([])
const tabelaSelecionada = ref(null)

// ── Filtros ──────────────────────────────────────────────────────────────────
const anoAtual = new Date().getFullYear()

const anosDisponiveis = Array.from({ length: 6 }, (_, i) => ({
  label: String(anoAtual - i),
  value: anoAtual - i,
}))

const statusOptions = [
  { label: 'Ativa', value: true },
  { label: 'Inativa', value: false },
]

const filtros = ref({
  ano: null,
  is_ativo: null,
  busca: '',
})

// ── API ──────────────────────────────────────────────────────────────────────
const buscarTabelas = async () => {
  loading.value = true
  try {
    const params = {}
    if (filtros.value.ano)      params.ano      = filtros.value.ano
    if (filtros.value.busca)    params.busca    = filtros.value.busca
    if (filtros.value.is_ativo !== null) params.is_ativo = filtros.value.is_ativo

    const { data } = await api.get('/tabela-custa', { params })
    tabelas.value = data.dados ?? data
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar tabelas', caption: e.response?.data?.mensagem })
  } finally {
    loading.value = false
  }
}

const buscarTabelasDebounce = debounce(buscarTabelas, 400)

// ── Navegação ─────────────────────────────────────────────────────────────────
const abrirAtos = (tabela) => {
  router.push({
    name: 'administracao.tabela-custa.atos.index',
    params: { tabelaCustaId: tabela.id },
  })
}

const abrirFormulario = (tabela = null) => {
  tabelaSelecionada.value = tabela
  $q.notify({ type: 'info', message: 'Edição em desenvolvimento', position: 'top' })
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (d) => d ? date.formatDate(d, 'DD/MM/YYYY') : '—'

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(buscarTabelas)
</script>

<style lang="scss" scoped>
.oslo-tabela-card {
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  }
}
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
