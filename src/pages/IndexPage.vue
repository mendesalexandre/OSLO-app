<template>
  <q-page padding>
    <div class="oslo-page-header">
      <h1 class="oslo-page-title">Início</h1>
      <p class="oslo-page-subtitle">Bem-vindo ao OSLO</p>
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-md-6">
        <q-card bordered flat>
          <q-card-section>
            <div style="color: var(--text-secondary); font-size: var(--font-size-sm)">
              Painel em desenvolvimento
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({ name: "IndexPage" });
</script>

<style lang="scss" scoped>
.oslo-page-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.oslo-page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.oslo-page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}
</style>
