<template>
  <div class="yes-no-option-group">
    <v-label v-if="label" :label="label" :obrigatorio="required" />

    <div class="bootstrap-radio-group">
      <q-radio v-model="localValue" :val="true" :label="yesLabel" :disable="disable" class="custom-radio" />
      <q-radio v-model="localValue" :val="false" :label="noLabel" :disable="disable" class="custom-radio" />
    </div>

    <div v-if="error" class="text-negative text-caption q-mt-xs">{{ error }}</div>
    <div v-if="hint && !error" class="text-grey-7 text-caption q-mt-xs">{{ hint }}</div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: [Boolean, null],
    default: null,
  },
  label: {
    type: String,
    default: "",
  },
  disable: {
    type: Boolean,
    default: false,
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
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const localValue = ref(props.modelValue);

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
  gap: 0.375rem;

  .bootstrap-radio-group {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  :deep(.custom-radio) {
    padding: 0;
    margin: 0;

    // Container interno - customização do círculo
    .q-radio__inner {
      width: 0 !important;
      // height: 20px;
      // min-width: 20px;
      // font-size: 20px;

      // Remove o ::before do Quasar que desalinha
      &::before {
        display: none !important;
      }
    }

    // O SVG do Quasar
    .q-radio__bg {
      width: 20px;
      height: 20px;
      overflow: visible;

      // Círculo externo
      path:first-child {
        fill: white;
        stroke: #dee2e6;
        stroke-width: 1.2px;
        vector-effect: non-scaling-stroke;
      }

      // Círculo interno (check)
      .q-radio__check {
        fill: #1976d2;
      }
    }

    // Quando selecionado (truthy)
    .q-radio__inner--truthy .q-radio__bg {
      path:first-child {
        stroke: #1976d2;
        stroke-width: 1.2px;
      }
    }

    // Quando não selecionado (falsy) - esconde o círculo interno
    .q-radio__inner--falsy .q-radio__bg {
      .q-radio__check {
        display: none;
      }
    }

    // Label - alinhado com o ícone
    .q-radio__label {
      font-size: 0.875rem;
      color: #37474f;
      padding-left: 0.5rem;
      line-height: 1.43;
    }

    .q-radio__bg {
      left: 0 !important;
    }

    // Alinhamento vertical correto
    &.row {
      align-items: center;
    }

    // Hover
    &:hover:not(.q-radio--disabled) .q-radio__bg path:first-child {
      stroke: #1976d2;
    }

    // Desabilitado
    &.q-radio--disabled {
      opacity: 0.6;

      .q-radio__bg path:first-child {
        fill: #e9ecef;
        stroke: #dee2e6;
      }
    }
  }

  .text-caption {
    font-size: 0.75rem;
    line-height: 1.25rem;
  }
}
</style>