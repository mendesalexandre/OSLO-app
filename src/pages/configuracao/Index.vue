<template>
  <q-page padding>
    <!-- Header da página -->
    <q-card bordered class="q-mb-md">
      <q-card-section class="q-pa-none">
        <div class="page-header">
          <q-icon name="fa-duotone fa-gear" size="20px" class="q-mr-sm page-header-icon" />
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
                  <q-icon name="fa-duotone fa-briefcase" size="18px" class="config-icon" />
                </q-item-section>
                <q-item-section>Cartório</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple to="/config/email" active-class="config-item-active" class="config-item">
                <q-item-section avatar>
                  <q-icon name="fa-duotone fa-envelope" size="18px" class="config-icon" />
                </q-item-section>
                <q-item-section>E-mail & WhatsApp</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple to="/config/selo" active-class="config-item-active" class="config-item">
                <q-item-section avatar>
                  <q-icon name="fa-duotone fa-award" size="18px" class="config-icon" />
                </q-item-section>
                <q-item-section>Selo</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple to="/config/indisponibilidade" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <q-icon name="fa-duotone fa-clock" size="18px" class="config-icon" />
                </q-item-section>
                <q-item-section>Indisponibilidade</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.centrais' }" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <q-icon name="fa-duotone fa-globe" size="18px" class="config-icon" />
                </q-item-section>
                <q-item-section>Centrais</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple to="/config/atendimento" active-class="config-item-active" class="config-item">
                <q-item-section avatar>
                  <q-icon name="fa-duotone fa-phone" size="18px" class="config-icon" />
                </q-item-section>
                <q-item-section>Atendimento</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.financeiro' }" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <q-icon name="fa-duotone fa-credit-card" size="18px" class="config-icon" />
                </q-item-section>
                <q-item-section>Financeiro</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.estatistica' }" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <q-icon name="fa-duotone fa-chart-column" size="18px" class="config-icon" />
                </q-item-section>
                <q-item-section>Portal de Estatísticas</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.onr.certidao.index' }"
                active-class="config-item-active" class="config-item">
                <q-item-section avatar>
                  <q-icon name="fa-duotone fa-file-lines" size="18px" class="config-icon" />
                </q-item-section>
                <q-item-section>ONR - Certidão</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.centrais.onr.eprotocolo.index' }"
                active-class="config-item-active" class="config-item">
                <q-item-section avatar>
                  <q-icon name="fa-duotone fa-file-check" size="18px" class="config-icon" />
                </q-item-section>
                <q-item-section>ONR - E-Protocolo</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-ripple :to="{ name: 'configuracao.doi' }" active-class="config-item-active"
                class="config-item">
                <q-item-section avatar>
                  <q-icon name="fa-duotone fa-file-signature" size="18px" class="config-icon" />
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

  .page-header-icon {
    --fa-primary-color: var(--text-color);
    --fa-secondary-color: var(--text-secondary);
    --fa-secondary-opacity: 0.6;
  }

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

    .config-icon {
      --fa-primary-color: var(--text-secondary);
      --fa-secondary-color: var(--text-muted);
      --fa-secondary-opacity: 0.6;
      transition: all var(--transition);
    }

    &:hover {
      background-color: var(--bg-subtle);

      .config-icon {
        --fa-primary-color: var(--text-color);
        --fa-secondary-color: var(--text-secondary);
      }
    }

    &.config-item-active {
      background-color: rgba(var(--primary-rgb), 0.08);

      .q-item-section {
        color: var(--primary);
        font-weight: 600;
      }

      .config-icon {
        --fa-primary-color: var(--primary);
        --fa-secondary-color: var(--accent);
        --fa-secondary-opacity: 0.7;
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