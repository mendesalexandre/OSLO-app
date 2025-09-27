<template>
  <q-dialog v-model="model" :persistent="persistente" allow-focus-outside :maximized="mobile" class="modal-custom-size">
    <div class="modal-dialogo" :class="`modal-${tamanho}`">
      <q-card :style="cardStyles" class="mover-modal modal-cabecalho" :class="cardCompleto ? 'h-full' : ''">
        <!-- Cabeçalho -->
        <q-card-section class="row items-center" :style="{ backgroundColor: corCabecalho }">
          <div class="text-h6 text-wrap" :class="corTituloCabecalho">
            {{ titulo }}
          </div>
          <q-space />
          <slot name="controles">
            <q-btn icon="close" round dense flat color="grey-7" @click="fechar()" :aria-label="'Fechar ' + titulo" />
          </slot>
        </q-card-section>

        <!-- Separador -->
        <q-separator v-if="separador" />

        <!-- Área de Tabs (se existir slot tabs) -->
        <div v-if="$slots.tabs" class="modal-tabs-container">
          <slot name="tabs"></slot>
        </div>

        <!-- Separador após tabs -->
        <q-separator v-if="$slots.tabs && separador" />

        <!-- Conteúdo -->
        <div class="modal-conteudo" :class="[
          background,
          $slots.tabs ? 'modal-has-tabs' : 'modal-no-tabs',
        ]">
          <slot></slot>
        </div>

        <!-- Rodapé -->
        <template v-if="$slots.rodape">
          <q-separator v-if="separador" />
          <div class="modal-rodape">
            <slot name="rodape"></slot>
          </div>
        </template>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { uid } from "quasar";
import { computed } from "vue";

defineOptions({
  name: "Modal",
});

const props = defineProps({
  nome: String,
  id: {
    type: String,
    default: `modal-${uid()}`,
  },
  titulo: {
    type: String,
    default: "Título do Modal",
  },
  visivel: {
    type: Boolean,
    default: true,
  },
  persistente: {
    type: Boolean,
    default: true,
  },
  separador: {
    type: Boolean,
    default: true,
  },
  altura: {
    type: [String, Number],
    default: "auto",
  },
  largura: {
    type: [String, Number],
    default: "auto",
  },
  background: {
    type: String,
    default: "bg-grey-2",
  },
  corCabecalho: {
    type: String,
    default: "",
  },
  corTituloCabecalho: {
    type: String,
    default: "text-primary",
  },
  cardCompleto: {
    type: Boolean,
    default: false,
  },
  mobile: {
    type: Boolean,
    default: false,
  },
  // Prop de tamanho
  tamanho: {
    type: String,
    default: "md",
    validator: (value) => ["xs", "sm", "md", "lg", "xl"].includes(value),
  },
});

const emit = defineEmits(["close"]);
const model = defineModel({ default: false });

// Computed para definir o width do card baseado no tamanho
const cardStyles = computed(() => {
  const tamanhos = {
    xs: "400px",
    sm: "500px",
    md: "700px",
    lg: "900px",
    xl: "1200px",
  };

  let styles = {
    width: tamanhos[props.tamanho],
  };

  // Se cor do cabeçalho foi definida via prop, aplicar aqui também
  if (props.corCabecalho) {
    styles.backgroundColor = props.corCabecalho;
  }

  return styles;
});

const fechar = (confirmar = false) => {
  model.value = false;
  emit("close", confirmar);
  if (e.keyCode === 27 && this.closeEsc && this.closeable) {
    emit("close", confirmar);
  }
};
</script>

<style lang="scss" scoped>
// QCARD MODAL CABECALHO
.modal-dialogo {
  width: 100% !important;
  height: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-cabecalho {
  position: relative;
}

// Container para tabs - Estilo baseado na imagem
.modal-tabs-container {
  // border-bottom: 1px solid #e0e0e0;
  // padding: 0 1rem;

  :deep(.q-tabs) {
    background: transparent;

    .q-tab {
      padding: 0px 16px;
      min-height: 30px !important;
      border-radius: 0;
      text-transform: none;
      color: #37474f;
      font-weight: 400;
      letter-spacing: 0.5px;

      &.q-tab--active {
        color: #495057;
        font-weight: 400;
      }

      &:hover {
        color: #495057;
        background-color: rgba(0, 0, 0, 0.04);
      }
    }

    .q-tab__indicator {
      height: 1px;
      background-color: #37474f;
    }

    .q-tab__label {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
      color: #37474f;
    }

    // Remove o ripple effect
    .q-ripple {
      display: none;
    }
  }
}

.modal-conteudo {
  height: 100%;
  overflow-y: auto;
  padding: 16px !important;
  background-color: #f5f5f5 !important;

  // Sem tabs (Header + Rodapé = ~150px)
  &.modal-no-tabs {
    max-height: calc(100vh - 200px);
  }

  // Com tabs (Header + Tabs + Rodapé = ~250px)
  &.modal-has-tabs {
    max-height: calc(100vh - 250px);
  }
}


.modal-rodape {
  background-color: #fff !important;
  border-radius: 2px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

// Tamanhos do modal
.modal-xs .modal-cabecalho {
  max-width: 400px !important;
  width: 100% !important;
}

.modal-sm .modal-cabecalho {
  max-width: 500px !important;
  width: 100% !important;
}

.modal-md .modal-cabecalho {
  max-width: 700px !important;
  width: 100% !important;
}

.modal-lg .modal-cabecalho {
  max-width: 900px;
  width: 100% !important;
}

.modal-xl .modal-cabecalho {
  max-width: 1200px;
  width: 100% !important;
}

// Responsividade para mobile
@media (max-width: 768px) {

  .modal-xs,
  .modal-sm,
  .modal-md,
  .modal-lg,
  .modal-xl {
    .modal-cabecalho {
      width: 100% !important;
      max-width: none !important;
    }
  }

  .modal-conteudo {
    &.modal-no-tabs {
      max-height: calc(100vh - 100px) !important;
    }

    &.modal-has-tabs {
      max-height: calc(100vh - 120px) !important;
    }

    padding: 12px !important;
  }
}

@media (max-width: 480px) {

  .modal-xs,
  .modal-sm,
  .modal-md,
  .modal-lg,
  .modal-xl {
    .modal-cabecalho {
      width: 98% !important;
    }
  }
}
</style>

<!-- CSS específico para este modal -->
<style lang="scss">
// Sobrescrever limitações do Quasar APENAS para este modal
.modal-custom-size {
  .q-dialog__inner {
    >div {
      max-width: none !important;
      max-height: none !important;
    }
  }

  @media (min-width: 600px) {
    &.q-dialog__inner--minimized {
      >div {
        max-width: none !important;
      }
    }

    // Ou se a estrutura for diferente, pode tentar esta:
    .q-dialog__inner--minimized {
      >div {
        max-width: none !important;
      }
    }
  }
}
</style>