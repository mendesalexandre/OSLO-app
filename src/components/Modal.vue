<template>
  <q-dialog v-model="model" :persistent="persistente" allow-focus-outside :maximized="mobile">
    <div class="modal-dialogo" :class="[`modal-${tamanho}`]" :style="{ width: largura, height: altura }">
      <q-card class="modal-card-container">
        <!-- HEADER FIXO -->
        <q-card-section class="modal-header-fixed" :style="{ backgroundColor: corCabecalho }">
          <div class="flex justify-between align-items-center">
            <!-- TÍTULO À ESQUERDA -->
            <div>
              <span :class="corTituloCabecalho">
                {{ titulo }}
              </span>
            </div>

            <!-- BOTÃO FECHAR À DIREITA -->
            <div>
              <q-btn flat round icon="close" @click="fechar" size="sm" color="grey-7" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- CONTEÚDO COM SCROLL -->
        <div class="modal-content-scroll">
          <slot></slot>
        </div>

        <!-- FOOTER FIXO (se houver conteúdo) -->
        <template v-if="$slots.rodape">
          <q-separator />
          <div class="modal-footer-fixed">
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
    default: "text-dark",
  },
  tamanho: {
    type: String,
    default: "md",
  },
  mobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);
const model = defineModel({ default: false });

const fechar = (confirmar) => {
  model.value = !model.value;
  emit("close", confirmar);
};
</script>

<style lang="scss" scoped>
.modal-dialogo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 100px);
  border-radius: 2px !important;
  overflow: hidden;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
}

.q-dialog__inner>div {
  border-radius: 2px !important;
}

// Header fixo - COMPACTO
.modal-header-fixed {
  flex-shrink: 0;
  background: #ffffff;
  border-bottom: 1px solid #dee2e6;
  min-height: 48px; // Reduzido

  span {
    font-size: 1rem !important; // Tamanho menor
    font-weight: 500 !important;
    line-height: 1.2;
  }
}

// Conteúdo com scroll
.modal-content-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem; // Reduzido
  background: #f8f9fa;

  &::-webkit-scrollbar {
    width: 6px; // Mais fino
  }

  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    // border-radius: 2px !important;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    // border-radius: 2px !important;

    &:hover {
      background: #495057;
    }
  }
}

// Footer fixo
.modal-footer-fixed {
  flex-shrink: 0;
  padding: 0.75rem 1rem; // Reduzido
  background: #ffffff;
  border-top: 1px solid #dee2e6;
  min-height: 48px; // Reduzido
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem; // Reduzido
}

// Tamanhos do modal
.modal-md {
  min-width: 800px;
  min-height: 500px;
}

.modal-lg {
  min-width: 1000px;
  min-height: 600px;
}

.modal-xl {
  min-width: 1200px;
  min-height: 700px;
}

.modal-sm {
  min-width: 500px;
  min-height: 300px;
}

// Responsividade
@media (max-width: 1024px) {
  .modal-dialogo {
    padding: 1rem;
  }

  .modal-xl,
  .modal-lg,
  .modal-md {
    min-width: auto;
    width: 100%;
    max-width: 95vw;
  }
}

@media (max-width: 768px) {
  .modal-card-container {
    max-height: calc(100vh - 2rem);
  }

  .modal-header-fixed {
    min-height: 44px;

    span {
      font-size: 0.9rem !important;
    }
  }

  .modal-content-scroll {
    padding: 0.75rem;
  }

  .modal-footer-fixed {
    padding: 0.5rem 0.75rem;
    min-height: 44px;
  }
}

// Mobile maximizado
@media (max-width: 600px) {
  .modal-dialogo {
    padding: 0;
  }

  .modal-card-container {
    max-height: 100vh;
    border-radius: 2px !important;
  }
}
</style>