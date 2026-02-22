<template>
  <q-page padding>

    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="oslo-page-title">Produtos / Serviços</div>
        <div class="oslo-page-subtitle">Catálogo unificado de produtos e serviços do cartório</div>
      </div>
      <div class="col-auto">
        <q-btn
          v-permissao="'PRODUTO_CRIAR'"
          unelevated color="primary" no-caps
          icon="fa-regular fa-plus"
          label="Novo Produto"
          @click="abrirModalCriar"
        />
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="q-py-sm">
        <div class="row q-col-gutter-md items-end">

          <div class="col-12 col-sm-5 col-md-4">
            <v-label label="Buscar" />
            <q-input
              v-model="filtros.busca"
              outlined dense clearable placeholder="Código ou nome..."
              @update:model-value="buscarDebounce"
            >
              <template #prepend>
                <q-icon name="fa-regular fa-magnifying-glass" size="14px" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-4 col-md-3">
            <v-label label="Tipo" />
            <q-select
              v-model="filtros.tipo"
              :options="tiposProdutoFiltro"
              option-label="label" option-value="value"
              outlined dense clearable emit-value map-options
              @update:model-value="buscar"
            >
              <template #prepend>
                <q-icon name="fa-regular fa-layer-group" size="14px" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-3 col-md-2">
            <v-label label="Status" />
            <q-select
              v-model="filtros.is_ativo"
              :options="statusOptions"
              option-label="label" option-value="value"
              outlined dense clearable emit-value map-options
              @update:model-value="buscar"
            >
              <template #prepend>
                <q-icon name="fa-regular fa-toggle-on" size="14px" />
              </template>
            </q-select>
          </div>

        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela -->
    <q-card flat bordered>
      <q-table
        :rows="produtoStore.produtos"
        :columns="colunas"
        :loading="produtoStore.loading"
        row-key="uuid"
        flat
        hide-bottom
        :rows-per-page-options="[0]"
        no-data-label="Nenhum produto encontrado"
        loading-label="Carregando produtos..."
      >

        <!-- Código -->
        <template #body-cell-codigo="props">
          <q-td :props="props">
            <q-chip dense color="grey-3" text-color="grey-8" class="text-caption text-weight-medium">
              {{ props.row.codigo }}
            </q-chip>
          </q-td>
        </template>

        <!-- Tipo -->
        <template #body-cell-tipo="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.tipo === 'TABELA_CUSTA' ? 'blue-7' : 'deep-purple-6'"
              :label="props.row.tipo === 'TABELA_CUSTA' ? 'Tabela de Custa' : 'Serviço Próprio'"
            />
          </q-td>
        </template>

        <!-- Valor -->
        <template #body-cell-valor="props">
          <q-td :props="props">
            <span v-if="props.row.tipo === 'TABELA_CUSTA'" class="text-caption text-grey-6 text-italic">
              dinâmico
            </span>
            <span v-else-if="props.row.tipo_calculo === 'GRATUITO'" class="text-positive text-weight-medium">
              Gratuito
            </span>
            <span v-else>
              {{ formatCurrency(props.row.valor) }}
            </span>
          </q-td>
        </template>

        <!-- Status -->
        <template #body-cell-is_ativo="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.is_ativo ? 'positive' : 'grey-5'"
              :label="props.row.is_ativo ? 'Ativo' : 'Inativo'"
            />
          </q-td>
        </template>

        <!-- Ações -->
        <template #body-cell-acoes="props">
          <q-td :props="props" auto-width>
            <div class="row no-wrap q-gutter-x-xs justify-end">

              <!-- Calcular -->
              <q-btn
                flat dense round
                icon="fa-regular fa-calculator"
                color="primary" size="sm"
                @click="abrirCalcular(props.row)"
              >
                <q-tooltip>Calcular</q-tooltip>
              </q-btn>

              <!-- Editar -->
              <q-btn
                v-permissao="'PRODUTO_EDITAR'"
                flat dense round
                icon="fa-regular fa-pen"
                color="grey-7" size="sm"
                @click="abrirModalEditar(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <!-- Excluir -->
              <q-btn
                v-permissao="'PRODUTO_EXCLUIR'"
                flat dense round
                icon="fa-regular fa-trash"
                color="negative" size="sm"
                @click="confirmarExcluir(props.row)"
              >
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>

            </div>
          </q-td>
        </template>

      </q-table>

      <!-- Paginação -->
      <q-card-section v-if="paginacao.ultima_pagina > 1" class="q-pt-none">
        <div class="row justify-center">
          <q-pagination
            v-model="filtros.pagina"
            :max="paginacao.ultima_pagina"
            :max-pages="7"
            boundary-numbers
            color="primary"
            @update:model-value="buscar"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal Criar/Editar -->
    <ModalProduto
      v-model="modalAberto"
      :produto="produtoSelecionado"
      @salvo="onSalvo"
    />

    <!-- Modal Calcular -->
    <ModalProdutoCalcular
      v-model="modalCalcularAberto"
      :produto="produtoParaCalcular"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useProdutoStore } from 'src/stores/produto'
import ModalProduto from 'src/components/produto/ModalProduto.vue'
import ModalProdutoCalcular from 'src/components/produto/ModalProdutoCalcular.vue'

defineOptions({ name: 'ProdutoIndex' })

const $q           = useQuasar()
const produtoStore = useProdutoStore()

// ── Estado ────────────────────────────────────────────────────────────────────
const modalAberto        = ref(false)
const modalCalcularAberto = ref(false)
const produtoSelecionado = ref(null)
const produtoParaCalcular = ref(null)

const paginacao = ref({ ultima_pagina: 1, total: 0 })

const filtros = ref({
  busca:    '',
  tipo:     null,
  is_ativo: null,
  pagina:   1,
})

// ── Opções ────────────────────────────────────────────────────────────────────
const tiposProdutoFiltro = [
  { label: 'Tabela de Custa', value: 'TABELA_CUSTA' },
  { label: 'Serviço Próprio', value: 'PROPRIO' },
]

const statusOptions = [
  { label: 'Ativo',   value: true  },
  { label: 'Inativo', value: false },
]

const colunas = [
  { name: 'codigo',   label: 'Código',   field: 'codigo',   align: 'left',   sortable: true },
  { name: 'nome',     label: 'Nome',     field: 'nome',     align: 'left',   sortable: true },
  { name: 'tipo',     label: 'Tipo',     field: 'tipo',     align: 'left'                   },
  { name: 'valor',    label: 'Valor',    field: 'valor',    align: 'right'                  },
  { name: 'is_ativo', label: 'Status',   field: 'is_ativo', align: 'center'                 },
  { name: 'acoes',    label: '',         field: 'acoes',    align: 'right'                  },
]

// ── Busca ─────────────────────────────────────────────────────────────────────
let debounceTimer = null

const buscarDebounce = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(buscar, 400)
}

const buscar = async () => {
  const params = { pagina: filtros.value.pagina }
  if (filtros.value.busca)         params.busca    = filtros.value.busca
  if (filtros.value.tipo !== null)  params.tipo     = filtros.value.tipo
  if (filtros.value.is_ativo !== null) params.is_ativo = filtros.value.is_ativo

  const resultado = await produtoStore.listar(params)
  if (resultado) {
    paginacao.value = {
      ultima_pagina: resultado.last_page ?? 1,
      total:         resultado.total ?? 0,
    }
  }
}

// ── Modais ────────────────────────────────────────────────────────────────────
const abrirModalCriar = () => {
  produtoSelecionado.value = null
  modalAberto.value        = true
}

const abrirModalEditar = (produto) => {
  produtoSelecionado.value = produto
  modalAberto.value        = true
}

const abrirCalcular = (produto) => {
  produtoParaCalcular.value = produto
  modalCalcularAberto.value = true
}

const onSalvo = () => {
  buscar()
}

// ── Excluir ───────────────────────────────────────────────────────────────────
const confirmarExcluir = (produto) => {
  $q.dialog({
    title:   'Excluir produto',
    message: `Deseja excluir o produto "<strong>${produto.nome}</strong>"?`,
    html:    true,
    cancel:  { label: 'Cancelar', flat: true, color: 'grey-7' },
    ok:      { label: 'Excluir',  unelevated: true, color: 'negative', noCaps: true },
  }).onOk(async () => {
    try {
      await produtoStore.excluir(produto.uuid)
      $q.notify({ type: 'positive', message: 'Produto excluído com sucesso', position: 'top' })
      buscar()
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Erro ao excluir produto', caption: e.response?.data?.mensagem })
    }
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)

// ── Inicialização ─────────────────────────────────────────────────────────────
onMounted(buscar)
</script>
