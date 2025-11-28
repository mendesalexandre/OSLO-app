<template>
  <label class="v-label">
    <span class="v-label-titulo" v-html="label" :title="obrigatorio ? 'Este campo é obrigatório' : ''" />

    <span v-if="obrigatorio" class="text-red-6">*</span>

    <q-icon v-if="ajuda" name="help_outline" size="16px" class="q-ml-sm cursor-pointer ">
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
  /* font-weight: 500; */
  /* font-size: 14px; */
}

.v-label-titulo {
  /* font-size: 14px; */
  /* font-weight: 500; */
  margin-bottom: 0.2rem;
  font-weight: bold;
  line-height: 1.2;
}
</style>