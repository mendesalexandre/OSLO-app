<!-- src/pages/administracao/TabelaCusta/Atos/Index.vue -->
<template>
  <q-page padding>
    <!-- Breadcrumbs -->
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el label="Home" icon="home" to="/" />
      <q-breadcrumbs-el label="Administração" to="/administracao" />
      <q-breadcrumbs-el label="Tabelas de Custas" :to="{ name: 'administracao.tabela-custa.index' }" />
      <!-- <q-breadcrumbs-el v-if="tabelaCusta" :label="tabelaCusta.nome" /> -->
    </q-breadcrumbs>

  </q-page>
</template>