<template>
  <label class="v-label">
    <span class="titulo" v-html="label" :title="obrigatorio ? 'Este campo é obrigatório' : ''" />

    <span v-if="obrigatorio" class="text-red-600">*</span>

    <q-icon v-if="ajuda" name="help_outline" size="16px" class="q-ml-xs cursor-pointer text-grey-7">
      <q-tooltip>{{ ajuda }}</q-tooltip>
    </q-icon>
  </label>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  obrigatorio: {
    type: Boolean,
    default: false,
  },
  ajuda: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.v-label {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  gap: 4px;
}

.titulo {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #37474f;
}
</style>