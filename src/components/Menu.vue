<template>
  <div>
    <!-- Modal do Menu -->
    <q-dialog v-model="model" maximized persistent position="left" allow-focus-outside>
      <q-layout view="lHh Lpr lFf" container class="bg-white text-dark" style="width: 300px">
        <q-header class="bg-white text-dark">
          <q-toolbar>
            <q-btn flat @click="model = false" round dense icon="fa-regular fa-bars" class="btn-small-icon"
              color="dark" />
            <q-toolbar-title class="menu-titulo">Menu</q-toolbar-title>
            <q-btn flat @click="model = false" round dense icon="fa-regular fa-xmark" class="btn-small-icon"
              color="dark" />
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page class="column no-wrap" :style-fn="getPageStyle">
            <q-scroll-area class="col">
              <q-list>
                <!-- SEÇÃO: CADASTRO DE PESSOAS -->
                <q-item-label header class="section-header">
                  <q-icon name="fa-regular fa-users" class="q-mr-sm" color="slate-600" />
                  Cadastro de Pessoas
                </q-item-label>

                <q-item clickable v-ripple class="menu-item" @click="openModalConsultarPessoa">
                  <q-item-section avatar>
                    <q-icon name="fa-regular fa-magnifying-glass" color="slate-500" />
                  </q-item-section>
                  <q-item-section>Consultar Pessoas</q-item-section>
                </q-item>

                <q-item clickable v-ripple class="menu-item" @click="navigateTo('nova-pessoa')">
                  <q-item-section avatar>
                    <q-icon name="fa-regular fa-user-plus" color="blue-600" size="16px" />
                  </q-item-section>
                  <q-item-section>Nova Pessoa</q-item-section>
                </q-item>

                <q-separator class="q-my-sm" />

                <!-- SEÇÃO: REGISTRO DE IMÓVEIS (RI) -->
                <q-item-label header class="section-header">
                  <q-icon name="fa-regular fa-house" class="q-mr-sm" color="slate-600" size="16px" />
                  Registro de Imóveis (RI)
                </q-item-label>

                <q-item v-for="(item, index) in riItems" :key="index" clickable v-ripple class="menu-item"
                  @click="handleRiItemClick(item)">
                  <q-item-section avatar>
                    <q-icon :name="getRiIcon(item.id)" :color="getRiIconColor(item.id)" size="16px" />
                  </q-item-section>
                  <q-item-section>{{ item.nome }}</q-item-section>
                </q-item>

                <q-separator class="q-my-sm" />

                <!-- SEÇÃO: REGISTRO DE TÍTULOS E DOCUMENTOS (RTD) -->
                <q-item-label header class="section-header">
                  <q-icon name="fa-regular fa-file-lines" class="q-mr-sm" color="slate-600" size="16px" />
                  RTD
                </q-item-label>

                <q-item v-for="(item, index) in rtdItems" :key="index" clickable v-ripple class="menu-item"
                  @click="navigateTo(`rtd-${index}`)">
                  <q-item-section avatar>
                    <q-icon :name="getRtdIcon(index)" :color="getRtdIconColor(index)" size="16px" />
                  </q-item-section>
                  <q-item-section>{{ item.nome }}</q-item-section>
                </q-item>

                <q-separator class="q-my-sm" />

                <!-- SEÇÃO: FINANCEIRO -->
                <q-item-label header class="section-header">
                  <q-icon name="fa-regular fa-credit-card" class="q-mr-sm" color="slate-600" size="16px" />
                  Financeiro
                </q-item-label>

                <q-item clickable v-ripple class="menu-item" @click="navigateTo('conta-pagar')">
                  <q-item-section avatar>
                    <q-icon name="fa-regular fa-arrow-up" color="red-600" size="16px" />
                  </q-item-section>
                  <q-item-section>Conta a Pagar</q-item-section>
                </q-item>

                <q-item clickable v-ripple class="menu-item" @click="navigateTo('conta-receber')">
                  <q-item-section avatar>
                    <q-icon name="fa-regular fa-arrow-down" color="green-600" size="16px" />
                  </q-item-section>
                  <q-item-section>Conta a Receber</q-item-section>
                </q-item>

                <q-item clickable v-ripple class="menu-item" @click="navigateTo('financeiro.caixa.index')">
                  <q-item-section avatar>
                    <q-icon name="fa-regular fa-box-archive" color="blue-600" size="16px" />
                  </q-item-section>
                  <q-item-section>Caixa</q-item-section>
                </q-item>

                <q-separator class="q-my-sm" />

                <!-- SEÇÃO: RELATÓRIOS -->
                <q-item-label header class="section-header">
                  <q-icon name="fa-regular fa-chart-column" class="q-mr-sm" color="slate-600" size="16px" />
                  Relatórios
                </q-item-label>

                <q-item clickable v-ripple class="menu-item" @click="navigateTo('relatorio-movimento')">
                  <q-item-section avatar>
                    <q-icon name="fa-regular fa-chart-line" color="blue-600" size="16px" />
                  </q-item-section>
                  <q-item-section>Movimento Diário</q-item-section>
                </q-item>

                <q-item clickable v-ripple class="menu-item" @click="navigateTo('relatorio-receita')">
                  <q-item-section avatar>
                    <q-icon name="fa-regular fa-chart-pie" color="green-600" size="16px" />
                  </q-item-section>
                  <q-item-section>Relatório de Receita</q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

defineOptions({
  name: "MenuNavegacao",
});

const $q = useQuasar();
const router = useRouter();

const model = defineModel({ default: false });
const showConsultarPessoaModal = ref(false);
const showSeloDigitalModal = ref(false);

function getPageStyle(offset, height) {
  return {
    height: `${height - offset}px`,
  };
}

const riItems = [
  {
    id: "PRENOTACAO",
    nome: "Livro 1 - Protocolo",
    rota: "centrais.onr.eprotocolo.index",
  },
  {
    id: "MATRICULA",
    nome: "Livro 2 - Matrículas",
    rota: "centrais.onr.eprotocolo.index",
  },
  {
    id: "REGISTRO_AUXILIAR",
    nome: "Livro 3 - Registro Auxiliar",
    rota: "centrais.onr.eprotocolo.index",
  },
  {
    id: "INDICADOR_REAL",
    nome: "Livro 4 - Indicador Real",
    rota: "centrais.onr.eprotocolo.index",
  },
  {
    id: "OFICIO",
    nome: "Ofício",
    rota: "oficio.index",
  },
  {
    id: "CONTRADITORIO",
    nome: "Contraditório",
    rota: "contraditorio.index",
  },
  {
    id: "NOTA_DEVOLUTIVA",
    nome: "Nota Devolutiva",
    rota: "nota-devolutiva.index",
  },
  {
    id: "INTIMACAO",
    nome: "Intimação",
    rota: "intimacao.index",
  },
  {
    id: "ONR_EPROTOCOLO",
    nome: "ONR - E-Protocolo",
    rota: "centrais.onr.eprotocolo.index",
  },
  {
    id: "ONR_ECERTIDAO",
    nome: "ONR - E-Certidão",
    rota: "centrais.onr.ecertidao.index",
  },
  {
    id: "ONR_EINTIMACAO",
    nome: "ONR - E-Intimação",
    rota: "centrais.onr.intimacao.index",
  },
  {
    id: "ONR_COMUNICACAO_PREFEITURA",
    nome: "ONR - Comunicação Prefeitura",
    rota: "onr.comunicacao.prefeitura.index",
  },
  {
    id: "ONR_VISUALIZACAO_MATRICULA",
    nome: "ONR - Visualização de Matrícula",
    rota: "centrais.onr.visualizacao-matricula.index",
  },
  {
    id: "SELO_DIGITAL",
    nome: "Selo Digital",
    rota: "selo-digital.index",
  },

  {
    id: "TRANSFERENCIA_MATRICULA",
    nome: "Transferência de Matrícula",
    rota: "imoveis.tranferencia-imoveis.index",
  },

  {
    id: "DECLARACAO_IMOBILIARIA",
    nome: "DOI - Declaração de Operações Imobiliárias",
    rota: "doi.index",
  },
];

const rtdItems = [
  { nome: "Livro A - Protocolo" },
  { nome: "Livro B - Registro" },
  { nome: "Livro F - Guarda e Conservação" },
  { nome: "Notificação" },
  { nome: "Certidão" },
];

const getRiIcon = (id) => {
  const icons = {
    PRENOTACAO: "fa-regular fa-list",
    MATRICULA: "fa-regular fa-house",
    REGISTRO_AUXILIAR: "fa-regular fa-book",
    INDICADOR_REAL: "fa-regular fa-map",
    ONR_EPROTOCOLO: "fa-regular fa-desktop",
    ONR_EINTIMACAO: "fa-regular fa-bell",
    ONR_ECERTIDAO: "fa-regular fa-award",
    OFICIO: "fa-regular fa-paper-plane",
    CONTRADITORIO: "fa-regular fa-shield-halved",
    NOTA_DEVOLUTIVA: "fa-regular fa-file-lines",
    INTIMACAO: "fa-regular fa-bell",
    ONR_COMUNICACAO_PREFEITURA: "fa-regular fa-layer-group",
    ONR_VISUALIZACAO_MATRICULA: "fa-regular fa-eye",
    SELO_DIGITAL: "fa-regular fa-stamp",
    DECLARACAO_IMOBILIARIA: "fa-regular fa-file-contract",
  };
  return icons[id] || "fa-regular fa-file-lines";
};

const getRiIconColor = (id) => {
  const colors = {
    PRENOTACAO: "slate-500",
    MATRICULA: "blue-600",
    REGISTRO_AUXILIAR: "slate-500",
    INDICADOR_REAL: "slate-500",
    ONR_EPROTOCOLO: "blue-600",
    ONR_EINTIMACAO: "amber-500",
    ONR_ECERTIDAO: "green-600",
    OFICIO: "blue-600",
    CONTRADITORIO: "red-600",
    NOTA_DEVOLUTIVA: "slate-500",
    INTIMACAO: "amber-500",
    ONR_COMUNICACAO_PREFEITURA: "slate-500",
    ONR_VISUALIZACAO_MATRICULA: "blue-600",
    SELO_DIGITAL: "green-600",
  };
  return colors[id] || "slate-500";
};

const getRtdIcon = (index) => {
  const icons = [
    "fa-regular fa-clipboard",
    "fa-regular fa-pen-to-square",
    "fa-regular fa-box-archive",
    "fa-regular fa-bell",
    "fa-regular fa-award",
  ];
  return icons[index] || "fa-regular fa-file-lines";
};

const getRtdIconColor = (index) => {
  const colors = ["slate-500", "blue-600", "slate-500", "amber-500", "green-600"];
  return colors[index] || "slate-500";
};

// Nova função para abrir modal de consultar pessoa
const openModalConsultarPessoa = () => {
  model.value = false; // Fecha o menu
  showConsultarPessoaModal.value = true; // Abre o modal de consultar pessoa
};

// Nova função para abrir modal de selo digital
const openModalSeloDigital = () => {
  model.value = false; // Fecha o menu
  showSeloDigitalModal.value = true;
};


const showBuscarMatriculaModal = ref(false);
// Função para abrir a busca de matrícula
const openModalBuscarMatricula = () => {
  model.value = false; // Fecha o menu
  showBuscarMatriculaModal.value = true;
};


// Função para determinar se é modal ou rota
const handleRiItemClick = (item) => {
  if (item.id === "SELO_DIGITAL") {
    openModalSeloDigital();

  } else if (item.id === "MATRICULA") {
    openModalBuscarMatricula();

  } else {
    navigateTo(item.rota);
  }
};

const navigateTo = (route, options = {}) => {
  const { closeModal = true, showNotification = false } = options;

  console.log(`Navegando para: ${route}`);
  router.push({ name: route });

  if (showNotification) {
    $q.notify({
      message: `Navegando para ${route}`,
      color: "slate-600",
      position: "top-right",
      icon: "fa-regular fa-location-arrow",
    });
  }

  if (closeModal) {
    model.value = false; // Fecha o modal do menu
  }
};
</script>

<style lang="scss" scoped>
:deep(.btn-small-icon .q-icon) {
  font-size: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--text-color);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 16px 16px 8px 16px;
}

.menu-titulo {
  font-weight: 500;
  color: var(--text-color);
  letter-spacing: 0;
}

.menu-item {
  border-radius: var(--radius-sm);
  margin: 1px 12px;
  transition: all var(--transition);
  min-height: 40px;

  &:hover {
    background-color: var(--bg-subtle);
    transform: translateX(2px);
  }

  .q-item__section--avatar {
    min-width: 40px;

    .q-icon {
      font-size: 1.1rem;
      color: var(--text-secondary);
    }
  }

  .q-item__section--main {
    font-size: var(--font-size-sm);
    color: var(--text-color);
  }
}

.q-separator {
  margin: 8px 16px;
  background-color: var(--border-color);
}

@media (max-width: 480px) {
  :deep(.q-layout-container) {
    .q-layout {
      width: 100vw !important;
    }
  }
}
</style>