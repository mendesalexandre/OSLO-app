<template>
  <div class="form-group yes-no-option-group">
    <label v-if="label">{{ label }}</label>
    <q-option-group v-model="localValue" :options="options" :inline="inline" :disable="disable" :type="typeInput"
      class="text-capitalize bootstrap-style-radio" :color="localValue ? 'positive' : 'negative'">
      <!-- <template v-slot:label="opt">
        <div class="row items-center">
          <span class="text-teal">{{ opt.label }}</span>
          <q-icon name="fa-solid fa-circle" size="1.5em" class="q-ml-sm" />
        </div>
      </template> -->
    </q-option-group>
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
    <div v-if="hint && !error" class="form-text text-muted">{{ hint }}</div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: null,
  },
  label: {
    type: String,
    default: "",
  },
  inline: {
    type: Boolean,
    default: true,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  typeInput: {
    type: String,
    default: "radio",
  },
  error: {
    type: String,
    default: "",
  },
  hint: {
    type: String,
    default: "",
  },
  yesLabel: {
    type: String,
    default: "Sim",
  },
  noLabel: {
    type: String,
    default: "Não",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const localValue = ref(props.modelValue);

const options = computed(() => [
  {
    label: props.yesLabel,
    value: true,
  },
  {
    label: props.noLabel,
    value: false,
  },
]);

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);

watch(localValue, (newValue) => {
  emit("update:modelValue", newValue);
  emit("change", newValue);
});
</script>

<style lang="scss" scoped>
.yes-no-option-group {
  display: flex;
  flex-direction: column;

  label {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  // Estilos para simular o radio do Bootstrap 4.6
  :deep(.bootstrap-style-radio) {
    display: flex;
    align-items: center;
    min-height: 40px; // Altura para alinhar com o q-input

    .q-option-group {
      margin: 0;
    }

    .q-radio {
      margin: 0;
      padding: 0;
      vertical-align: middle;

      &__inner {
        width: 2rem;
        height: 2rem;

        &:before {
          border-radius: 50%;
          background: white;
          border: 1px solid #ced4da;
        }
      }

      &__bg {
        border-radius: 50%;
      }

      &__label {
        // font-size: 1rem;
        color: #212529;
        padding-left: 0.25rem;
        margin-left: -15px; // Aproxima o texto do input radio
      }
    }

    // Ajustes para quando as opções são inline
    &.q-option-group--inline {
      display: flex;
      align-items: center;

      >div {
        margin-right: 0.3rem;
        display: flex;
        align-items: center;
      }
    }
  }

  // Ajustes para o feedback de erro e hint
  .invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .form-text {
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
}

// Ajustes específicos para alinhar com q-input
:deep(.q-field__control) {
  height: 40px;
}

// Ajuste vertical quando ao lado de um q-input
.full-height {
  min-height: 56px; // Altura padrão do q-input com label

  .bootstrap-style-radio {
    position: relative;
    top: 6px; // Pequeno ajuste vertical
  }
}
</style>