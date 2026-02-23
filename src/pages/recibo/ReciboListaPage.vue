<template>
  <q-page padding>
    <!-- Header -->
    <div class="oslo-page-header">
      <div>
        <h1 class="oslo-page-title">Recibos</h1>
        <p class="oslo-page-subtitle">Consulte e imprima os recibos emitidos</p>
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <v-label label="Número do Recibo" />
            <q-input
              v-model="filtros.numero"
              outlined
              dense
              placeholder="Ex: 2024/R000001"
              clearable
              @update:model-value="aplicarFiltros"
            />
          </div>

          <div class="col-12 col-md-3">
            <v-label label="Data Início" />
            <q-input
              v-model="filtros.data_inicio"
              outlined
              dense
              type="date"
              clearable
              @update:model-value="aplicarFiltros"
            />
          </div>

          <div class="col-12 col-md-3">
            <v-label label="Data Fim" />
            <q-input
              v-model="filtros.data_fim"
              outlined
              dense
              type="date"
              clearable
              @update:model-value="aplicarFiltros"
            />
          </div>

          <div class="col-12 col-md-3 flex items-end">
            <q-btn
              label="Limpar Filtros"
              outline
              color="grey-7"
              no-caps
              class="full-width"
              @click="limparFiltros"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela -->
    <q-card flat bordered>
      <q-card-section>
        <q-table
          :rows="recibos"
          :columns="columns"
          row-key="id"
          :loading="carregando"
          flat
          :pagination="paginacao"
          @request="onRequest"
        >
          <template v-slot:body-cell-numero="props">
            <q-td :props="props">
              <span class="text-weight-bold text-primary">{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-protocolo="props">
            <q-td :props="props">
              <router-link
                :to="{ name: 'protocolo.geral', params: { uuid: props.row.protocolo?.uuid } }"
                class="text-primary"
                style="text-decoration: none"
              >
                {{ props.value }}
              </router-link>
            </q-td>
          </template>

          <template v-slot:body-cell-valor_pago="props">
            <q-td :props="props">
              <span class="text-weight-bold text-green-8">{{ formatarDinheiroBrasil(props.value) }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-acoes="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                size="sm"
                icon="eva-eye-outline"
                color="primary"
                @click="previewRecibo(props.row)"
              >
                <q-tooltip>Preview HTML</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                size="sm"
                icon="eva-download-outline"
                color="green-7"
                @click="downloadPDF(props.row)"
              >
                <q-tooltip>Download PDF</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                size="sm"
                icon="eva-info-outline"
                color="grey-7"
                @click="visualizarRecibo(props.row)"
              >
                <q-tooltip>Ver Detalhes</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal de preview do recibo -->
    <recibo-preview-modal
      v-model="modalPreview"
      :recibo-id="reciboIdSelecionado"
      :protocolo-id="protocoloIdSelecionado"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'
import { api } from 'src/boot/axios'
import { formatarDinheiroBrasil } from 'src/Utils'
import ReciboPreviewModal from 'src/components/recibo/ReciboPreviewModal.vue'

defineOptions({ name: 'ReciboListaPage' })

const $q = useQuasar()

const recibos = ref([])
const carregando = ref(false)
const modalPreview = ref(false)
const reciboIdSelecionado = ref(null)
const protocoloIdSelecionado = ref(null)

const filtros = reactive({
  numero: '',
  data_inicio: '',
  data_fim: '',
})

const paginacao = ref({
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0,
})

const columns = [
  {
    name: 'numero',
    label: 'Número',
    field: 'numero',
    align: 'left',
    sortable: true,
  },
  {
    name: 'protocolo',
    label: 'Protocolo',
    field: (row) => row.protocolo?.numero || '-',
    align: 'left',
  },
  {
    name: 'solicitante',
    label: 'Solicitante',
    field: 'solicitante_nome',
    align: 'left',
    sortable: true,
  },
  {
    name: 'data_emissao',
    label: 'Data de Emissão',
    field: 'data_emissao',
    align: 'left',
    format: (val) => date.formatDate(val, 'DD/MM/YYYY HH:mm'),
    sortable: true,
  },
  {
    name: 'valor_pago',
    label: 'Valor Pago',
    field: 'valor_pago',
    align: 'right',
  },
  {
    name: 'acoes',
    label: 'Ações',
    field: 'acoes',
    align: 'center',
  },
]

onMounted(() => {
  carregarRecibos()
})

async function carregarRecibos() {
  carregando.value = true
  try {
    const { data } = await api.get('/recibo', {
      params: {
        ...filtros,
        pagina: paginacao.value.page,
        por_pagina: paginacao.value.rowsPerPage,
      },
    })

    if (data.sucesso) {
      const paginado = data.dados
      recibos.value = paginado.data || []
      paginacao.value.rowsNumber = paginado.total || 0
    }
  } catch (error) {
    console.error('Erro ao carregar recibos:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar recibos',
      position: 'top',
    })
  } finally {
    carregando.value = false
  }
}

function onRequest(props) {
  paginacao.value.page = props.pagination.page
  paginacao.value.rowsPerPage = props.pagination.rowsPerPage
  carregarRecibos()
}

function aplicarFiltros() {
  paginacao.value.page = 1
  carregarRecibos()
}

function limparFiltros() {
  filtros.numero = ''
  filtros.data_inicio = ''
  filtros.data_fim = ''
  aplicarFiltros()
}

function previewRecibo(recibo) {
  reciboIdSelecionado.value = recibo.id
  protocoloIdSelecionado.value = recibo.protocolo_id || null
  modalPreview.value = true
}

async function downloadPDF() {
  $q.notify({
    type: 'info',
    message: 'Funcionalidade de PDF em desenvolvimento',
    position: 'top',
  })
}

function visualizarRecibo(recibo) {
  previewRecibo(recibo)
}
</script>

<style lang="scss" scoped>
.oslo-page-header {
  margin-bottom: 24px;
}

.oslo-page-title {
  font-size: 24px;
  font-weight: 700;
  color: #202124;
  margin: 0;
  line-height: 1.3;
}

.oslo-page-subtitle {
  font-size: 14px;
  color: #5F6368;
  margin: 4px 0 0 0;
}

.info-item {
  padding: 8px 0;
  line-height: 1.6;
}
</style>
