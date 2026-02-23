<template>
  <q-page padding>
    <!-- Header -->
    <div class="oslo-page-header">
      <div>
        <h1 class="oslo-page-title">Protocolos</h1>
        <p class="oslo-page-subtitle">Gerencie os protocolos do cartório</p>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Criar Protocolo"
        unelevated
        no-caps
        @click="$router.push('/protocolo/criar')"
      />
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filtros.busca"
              outlined
              dense
              placeholder="Buscar por número, solicitante..."
              @keyup.enter="buscar"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="filtros.status"
              outlined
              dense
              placeholder="Status"
              :options="statusOptions"
              emit-value
              map-options
              clearable
              @update:model-value="buscar"
            />
          </div>

          <div class="col-12 col-md-2">
            <q-input
              v-model="filtros.data_inicio"
              outlined
              dense
              placeholder="Data início"
              mask="##/##/####"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy>
                    <q-date v-model="filtros.data_inicio" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="OK" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <q-input
              v-model="filtros.data_fim"
              outlined
              dense
              placeholder="Data fim"
              mask="##/##/####"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy>
                    <q-date v-model="filtros.data_fim" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="OK" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-1">
            <q-btn
              color="primary"
              icon="search"
              label="Buscar"
              unelevated
              no-caps
              class="full-width"
              @click="buscar"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela -->
    <q-card flat bordered>
      <q-table
        :rows="protocolos"
        :columns="columns"
        row-key="id"
        flat
        :loading="carregando"
        :pagination="paginacaoTable"
        @request="onRequest"
        @row-click="abrirDetalhe"
        class="oslo-table-protocolos"
      >
        <template v-slot:body-cell-numero="props">
          <q-td :props="props">
            <span class="text-weight-bold text-primary">{{ props.value }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-valor_final="props">
          <q-td :props="props">
            <span class="text-weight-medium">{{ formatarDinheiroBrasil(props.value) }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.value)"
              text-color="white"
              size="sm"
              class="q-px-sm"
            >
              {{ getStatusLabel(props.value) }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-data_cadastro="props">
          <q-td :props="props">
            {{ formatarData(props.value) }}
          </q-td>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-gutter-sm text-grey-6 q-pa-lg">
            <l-icon name="inbox" :size="48" />
            <span>Nenhum protocolo encontrado</span>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProtocoloStore } from 'src/stores/protocolo'
import { storeToRefs } from 'pinia'
import { formatarDinheiroBrasil, formatarData } from 'src/Utils'

defineOptions({ name: 'ProtocoloListaPage' })

const router = useRouter()
const protocoloStore = useProtocoloStore()
const { protocolos, carregando, filtros, paginacao } = storeToRefs(protocoloStore)

const statusOptions = [
  { label: 'Aberto', value: 'aberto' },
  { label: 'Pago', value: 'pago' },
  { label: 'Pago Parcial', value: 'pago_parcial' },
  { label: 'Isento', value: 'isento' },
  { label: 'Cancelado', value: 'cancelado' },
]

const columns = [
  {
    name: 'numero',
    label: 'Número',
    field: 'numero',
    align: 'left',
    sortable: true,
  },
  {
    name: 'solicitante_nome',
    label: 'Solicitante',
    field: 'solicitante_nome',
    align: 'left',
    sortable: true,
  },
  {
    name: 'valor_final',
    label: 'Valor',
    field: 'valor_final',
    align: 'right',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'data_cadastro',
    label: 'Data',
    field: 'data_cadastro',
    align: 'center',
    sortable: true,
  },
]

const paginacaoTable = computed(() => ({
  page: paginacao.value.pagina_atual,
  rowsPerPage: paginacao.value.por_pagina,
  rowsNumber: paginacao.value.total,
}))

async function buscar() {
  await protocoloStore.listar(1)
}

async function onRequest(props) {
  await protocoloStore.listar(props.pagination.page)
}

function abrirDetalhe(evt, row) {
  router.push(`/protocolo/${row.uuid}`)
}

function getStatusColor(status) {
  const cores = {
    aberto: 'blue',
    pago: 'green',
    pago_parcial: 'orange',
    isento: 'grey',
    cancelado: 'red',
  }
  return cores[status] || 'grey'
}

function getStatusLabel(status) {
  const labels = {
    aberto: 'Aberto',
    pago: 'Pago',
    pago_parcial: 'Pago Parcial',
    isento: 'Isento',
    cancelado: 'Cancelado',
  }
  return labels[status] || status
}

onMounted(() => {
  protocoloStore.listar()
})
</script>

<style lang="scss" scoped>
.oslo-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;

    .q-btn {
      width: 100%;
    }
  }
}

.oslo-page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  line-height: 1.3;
}

.oslo-page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}

.oslo-table-protocolos {
  :deep(tbody tr) {
    cursor: pointer;

    &:hover {
      background: var(--bg-subtle);
    }
  }
}
</style>
