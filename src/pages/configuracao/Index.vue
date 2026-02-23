<template>
  <q-page padding>
    <!-- Header da página -->
    <q-card bordered class="q-mb-md">
      <q-card-section class="q-pa-none">
        <div class="page-header">
          <l-icon name="settings" :size="20" class="q-mr-sm" />
          <span class="page-title">Configuração do Sistema</span>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      <!-- Menu lateral -->
      <div class="col-md-3 col-sm-12 col-xs-12">
        <q-card bordered>
          <q-card-section class="q-pa-none">
            <q-list class="config-menu">
              <q-item clickable v-ripple :to="{ name: 'configuracao.cartorio' }" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <l-icon name="briefcase" :size="18" />
                </q-item-section>
                <q-item-section>Cartório</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple to="/config/email" active-class="config-item-active" class="config-item">
                <q-item-section avatar>
                  <l-icon name="mail" :size="18" />
                </q-item-section>
                <q-item-section>E-mail & WhatsApp</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple to="/config/selo" active-class="config-item-active" class="config-item">
                <q-item-section avatar>
                  <l-icon name="award" :size="18" />
                </q-item-section>
                <q-item-section>Selo</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple to="/config/indisponibilidade" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <l-icon name="clock" :size="18" />
                </q-item-section>
                <q-item-section>Indisponibilidade</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.centrais' }" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <l-icon name="globe" :size="18" />
                </q-item-section>
                <q-item-section>Centrais</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple to="/config/atendimento" active-class="config-item-active" class="config-item">
                <q-item-section avatar>
                  <l-icon name="phone" :size="18" />
                </q-item-section>
                <q-item-section>Atendimento</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.financeiro' }" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <l-icon name="credit-card" :size="18" />
                </q-item-section>
                <q-item-section>Financeiro</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.estatistica' }" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <l-icon name="bar-chart-2" :size="18" />
                </q-item-section>
                <q-item-section>Portal de Estatísticas</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.onr.certidao.index' }"
                active-class="config-item-active" class="config-item">
                <q-item-section avatar>
                  <l-icon name="file-text" :size="18" />
                </q-item-section>
                <q-item-section>ONR - Certidão</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.centrais.onr.eprotocolo.index' }"
                active-class="config-item-active" class="config-item">
                <q-item-section avatar>
                  <l-icon name="file-check" :size="18" />
                </q-item-section>
                <q-item-section>ONR - E-Protocolo</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.doi' }" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <l-icon name="file-pen-line" :size="18" />
                </q-item-section>
                <q-item-section>DOI - Declaração sobre Operações Imobiliárias</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Área de conteúdo dinâmica -->
      <div class="col-md-9 col-sm-12 col-xs-12">
        <router-view />
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Nenhuma lógica complexa necessária
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;
  padding: 16px;

  .page-title {
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--text-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.config-menu {
  .config-item {
    transition: all var(--transition);
    border-radius: 0;
    padding: 12px 16px;

    &:hover {
      background-color: var(--bg-subtle);
    }

    &.config-item-active {
      background-color: rgba(var(--primary-rgb), 0.08);

      .q-item-section {
        color: var(--primary);
        font-weight: 600;
      }
    }
  }

  .q-separator {
    background-color: var(--border-color);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 12px 16px;

    .page-title {
      font-size: var(--font-size-sm);
    }
  }

  .config-item {
    padding: 10px 12px !important;
  }
}
</style>