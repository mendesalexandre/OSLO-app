<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Tabelas de Custas</div>
        <div class="text-caption text-grey-7">
          Gerencie as tabelas de custas por estado e município
        </div>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nova Tabela" @click="abrirFormulario()" />
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- Ano -->
          <div class="col-12 col-sm-6 col-md-3">
            <v-label label="Ano"></v-label>
            <q-select v-model="filtros.ano" :options="anosDisponiveis" outlined dense clearable
              @update:model-value="buscarTabelas">
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-select>
          </div>

          <!-- Estado -->
          <div class="col-12 col-sm-6 col-md-3">
            <v-label label="Estado"></v-label>
            <q-select v-model="filtros.estado_id" :options="estados" option-label="nome" option-value="id" emit-value
              map-options outlined dense clearable @update:model-value="buscarTabelas">
              <template v-slot:prepend>
                <q-icon name="place" />
              </template>
            </q-select>
          </div>

          <!-- Status -->
          <div class="col-12 col-sm-6 col-md-2">
            <v-label label="Status"></v-label>
            <q-select v-model="filtros.is_ativo" :options="statusOptions" option-label="label" option-value="value"
              emit-value map-options outlined dense clearable @update:model-value="buscarTabelas">
              <template v-slot:prepend>
                <q-icon name="toggle_on" />
              </template>
            </q-select>
          </div>

          <!-- Busca -->
          <div class="col-12 col-sm-6 col-md-4">
            <v-label label="Buscar por nome"></v-label>
            <q-input v-model="filtros.busca" outlined dense clearable @update:model-value="buscarTabelasDebounce">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading -->
    <q-card v-if="loading" flat bordered>
      <q-card-section>
        <div class="text-center q-py-xl">
          <q-spinner color="primary" size="50px" />
          <div class="text-grey-7 q-mt-md">Carregando tabelas...</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Lista de Tabelas -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="tabela in tabelas" :key="tabela.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="cursor-pointer" @click="abrirAtos(tabela)">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h6">{{ tabela.nome }}</div>
                <div class="text-caption text-grey-7">
                  {{ tabela.nome }}
                  <span v-if="tabela.cidade"> - {{ tabela.cidade.nome }}</span>
                </div>
              </div>
              <div class="col-auto">
                <q-badge :color="tabela.is_ativo ? 'positive' : 'grey-5'"
                  :label="tabela.is_ativo ? 'Ativa' : 'Inativa'" />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-sm text-caption">
              <div class="col-6">
                <div class="text-grey-7">Ano</div>
                <div class="text-weight-medium">{{ tabela.ano }}</div>
              </div>
              <div class="col-6">
                <div class="text-grey-7">Total de Atos</div>
                <div class="text-weight-medium">{{ tabela.atos_count || 0 }}</div>
              </div>
              <div class="col-6">
                <div class="text-grey-7">Vigência Início</div>
                <div class="text-weight-medium">{{ formatDate(tabela.vigencia_inicio) }}</div>
              </div>
              <div class="col-6">
                <div class="text-grey-7">Vigência Fim</div>
                <div class="text-weight-medium">
                  {{ tabela.vigencia_fim ? formatDate(tabela.vigencia_fim) : 'Indeterminado' }}
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat dense icon="list" label="Ver Atos" color="primary" @click.stop="abrirAtos(tabela)" />
            <q-space />
            <q-btn flat dense round icon="edit" color="primary" @click.stop="abrirFormulario(tabela)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat dense round icon="delete" color="negative" @click.stop="confirmarExclusao(tabela)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <!-- Sem dados -->
      <div v-if="!tabelas.length" class="col-12">
        <q-card flat bordered class="bg-grey-2">
          <q-card-section class="text-center q-py-xl">
            <q-icon name="inbox" size="64px" color="grey-6" class="q-mb-md" />
            <div class="text-h6 text-grey-7">Nenhuma tabela encontrada</div>
            <div class="text-caption text-grey-6 q-mt-sm">
              Crie uma nova tabela de custas para começar
            </div>
            <q-btn color="primary" label="Criar Primeira Tabela" icon="add" class="q-mt-md"
              @click="abrirFormulario()" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog de Formulário -->
    <!-- <q-dialog v-model="dialogFormulario" persistent>
      <formulario-tabela :tabela="tabelaSelecionada" @salvo="onTabelaSalva" @cancelar="dialogFormulario = false" />
    </q-dialog> -->
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { debounce, date } from 'quasar'
// import FormularioTabela from './components/FormularioTabela.vue'

const $q = useQuasar()
const router = useRouter()

// Estado
const loading = ref(false)
const tabelas = ref([])
const tabelaSelecionada = ref(null)
const dialogFormulario = ref(false)

// Filtros
const filtros = ref({
  ano: null,
  estado_id: null,
  is_ativo: null,
  busca: ''
})

const anosDisponiveis = ref([])
const estados = ref([])
const statusOptions = ref([
  { label: 'Ativa', value: true },
  { label: 'Inativa', value: false }
])

// Methods
const carregarDadosIniciais = async () => {
  try {
    const [anosRes, estadosRes] = await Promise.all([
      api.get('/tabela-custa/anos-disponiveis'),
      api.get('/estados')
    ])

    anosDisponiveis.value = anosRes.data
    estados.value = estadosRes.data
  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error)
  }
}

const buscarTabelas = async () => {
  loading.value = true

  try {
    const { data } = await api.get('/tabela-custa', {
      params: filtros.value
    })

    tabelas.value = data
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar tabelas',
      caption: error.response?.data?.message
    })
  } finally {
    loading.value = false
  }
}

const buscarTabelasDebounce = debounce(buscarTabelas, 500)

const abrirAtos = (tabela) => {
  router.push({
    name: 'administracao.tabela-custa.atos.index',
    params: { tabelaCustaId: tabela.uuid }
  })
}

const abrirFormulario = (tabela = null) => {
  tabelaSelecionada.value = tabela
  dialogFormulario.value = true
}

const confirmarExclusao = (tabela) => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja realmente excluir a tabela "${tabela.nome}"? Todos os atos vinculados também serão excluídos.`,
    cancel: {
      label: 'Cancelar',
      flat: true
    },
    ok: {
      label: 'Excluir',
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/tabela-custa/${tabela.id}`)

      $q.notify({
        type: 'positive',
        message: 'Tabela excluída com sucesso'
      })

      buscarTabelas()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir tabela',
        caption: error.response?.data?.message
      })
    }
  })
}

const onTabelaSalva = () => {
  dialogFormulario.value = false
  buscarTabelas()

  $q.notify({
    type: 'positive',
    message: 'Tabela salva com sucesso'
  })
}

// Helpers
const formatDate = (dateString) => {
  return date.formatDate(dateString, 'DD/MM/YYYY')
}

// Lifecycle
onMounted(() => {
  carregarDadosIniciais()
  buscarTabelas()
})
</script>