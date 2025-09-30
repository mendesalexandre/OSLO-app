<template>
  <div class="yes-no-option-group">
    <v-label v-if="label" :label="label" :obrigatorio="required" />

    <div class="bootstrap-radio-group">
      <q-radio v-model="localValue" :val="true" :label="yesLabel" :disable="disable" />
      <q-radio v-model="localValue" :val="false" :label="noLabel" :disable="disable" />
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
:deep(.q-radio__bg) {
  top: 25%;
  left: 0 !important;
  right: 0 !important;
  width: 50%;

  /* height: 50%; */
  &:hover:not(.q-radio--disabled) .q-radio__bg path:first-child {
    stroke: #1976d2;
  }
}

:deep(.q-radio__inner) {
  // font-size: 20px !important;
}

// :deep(.q-radio__inner--truthy) {
//   color: red;
// }

// :deep(.q-radio__inner--falsy) {
//   color: red;
// }

.yes-no-option-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  .bootstrap-radio-group {
    display: flex;
    gap: 0.5rem;
    // align-items: center;
  }
}
</style>