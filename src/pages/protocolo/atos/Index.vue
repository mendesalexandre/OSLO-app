<template>
  <q-page>
    <!-- Header compacto -->
    <q-header class="text-dark bg-white shadow-sm compact-header" elevated>
      <q-toolbar class="q-py-xs">
        <div class="row items-center full-width q-gutter-sm">
          <!-- Info do protocolo compacta -->
          <div class="protocol-badge-compact">
            <q-chip :label="titulo" color="grey-3" text-color="grey-9" size="sm"
              class="rounded-borders text-weight-medium" />
          </div>

          <!-- TABS COMPACTAS -->
          <q-tabs no-caps v-model="tab" align="left" class="compact-tabs" active-color="primary"
            indicator-color="primary" dense>
            <q-route-tab name="geral" class="compact-tab" :to="{
              name: 'protocolo.geral',
              params: { id: $route.params.id },
            }">
              <div class="tab-content-compact">
                <q-icon name="eva-info-outline" size="16px" />
                <span class="tab-label-compact">Geral</span>
              </div>
            </q-route-tab>

            <q-route-tab name="ato_registro" class="compact-tab"
              :to="{ name: 'protocolo.atos', params: { id: $route.params.id } }">
              <div class="tab-content-compact">
                <q-icon name="eva-calculator-outline" size="16px" />
                <span class="tab-label-compact">Atos</span>
                <q-chip v-if="totalAtos > 0" :label="totalAtos" color="orange-3" text-color="orange-8" size="xs"
                  class="rounded-borders tab-badge-compact" />
              </div>
            </q-route-tab>

            <q-route-tab name="financeiro" class="compact-tab" :to="{
              name: 'protocolo.financeiro',
              params: { id: $route.params.id },
            }">
              <div class="tab-content-compact">
                <q-icon name="eva-credit-card-outline" size="16px" />
                <span class="tab-label-compact">Financeiro</span>
                <q-chip v-if="valorRestante > 0" label="!" color="red-3" text-color="red-8" size="xs"
                  class="rounded-borders tab-badge-compact" />
              </div>
            </q-route-tab>
          </q-tabs>

          <q-space />

          <!-- Ações principais compactas -->
          <div class="row q-gutter-xs">
            <q-btn v-if="valorRestante > 0" color="green-6" size="sm" icon="eva-credit-card-outline"
              @click="receberPagamento" class="rounded-borders" dense>
              <q-tooltip>Receber Pagamento</q-tooltip>
            </q-btn>

            <q-btn color="blue-6" size="sm" icon="eva-printer-outline" outline @click="imprimirProtocolo"
              class="rounded-borders" dense>
              <q-tooltip>Imprimir</q-tooltip>
            </q-btn>

            <q-btn icon="eva-more-vertical-outline" flat round size="sm" color="grey-7">
              <q-menu class="rounded-borders">
                <q-list dense>
                  <q-item clickable @click="duplicarProtocolo" class="q-py-xs">
                    <q-item-section avatar>
                      <q-icon name="eva-copy-outline" size="16px" />
                    </q-item-section>
                    <q-item-section>
                      <div class="text-caption">Duplicar</div>
                    </q-item-section>
                  </q-item>

                  <q-item clickable @click="arquivarProtocolo" class="q-py-xs">
                    <q-item-section avatar>
                      <q-icon name="eva-archive-outline" size="16px" />
                    </q-item-section>
                    <q-item-section>
                      <div class="text-caption">Arquivar</div>
                    </q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable @click="excluirProtocolo" class="text-negative q-py-xs">
                    <q-item-section avatar>
                      <q-icon name="eva-trash-2-outline" size="16px" />
                    </q-item-section>
                    <q-item-section>
                      <div class="text-caption">Excluir</div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Conteúdo principal -->
    <div class="protocol-content-compact">
      <router-view />
    </div>

    <!-- Footer financeiro compacto -->
    <q-footer class="bg-white text-dark compact-footer" elevated>
      <q-card-section class="q-py-sm">
        <div class="row items-center justify-between">
          <!-- Resumo financeiro inline -->
          <div class="col">
            <div class="financial-summary-compact">
              <div class="row items-center q-gutter-md">
                <div class="summary-item-compact">
                  <span class="text-caption text-grey-6">Total:</span>
                  <span class="text-weight-bold text-grey-8 q-ml-xs">
                    {{ formatarDinheiroBrasil(totalEmolumentoAtual) }}
                  </span>
                </div>

                <div v-if="valorDesconto > 0" class="summary-item-compact">
                  <span class="text-caption text-grey-6">Desconto:</span>
                  <span class="text-weight-medium text-red-6 q-ml-xs">
                    -{{ formatarDinheiroBrasil(valorDesconto) }}
                  </span>
                </div>

                <div v-if="valorPago > 0" class="summary-item-compact">
                  <span class="text-caption text-grey-6">Pago:</span>
                  <span class="text-weight-medium text-green-6 q-ml-xs">
                    {{ formatarDinheiroBrasil(valorPago) }}
                  </span>
                </div>

                <div class="summary-item-compact">
                  <span class="text-caption text-grey-6">Restante:</span>
                  <span class="text-weight-bold text-primary q-ml-xs">
                    {{ formatarDinheiroBrasil(valorRestante) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Status visual -->
          <div class="col-auto">
            <q-chip v-if="valorRestante > 0" label="Pendente" color="orange-3" text-color="orange-8" size="sm"
              class="rounded-borders" />
            <q-chip v-else label="Quitado" color="green-3" text-color="green-8" size="sm" class="rounded-borders" />
          </div>
        </div>
      </q-card-section>
    </q-footer>
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useProtocoloStore } from "src/stores/protocolo";
import { computed, onMounted, ref, readonly } from "vue";
import { useRoute, useRouter } from "vue-router";

const tab = ref("geral");

defineOptions({
  name: "ProtocoloIndex",
});

import { useQuasar } from "quasar";
import { formatarDinheiroBrasil } from "src/Utils";

const titulo = computed(() => {
  if (!protocolo.value?.id) return "Novo Protocolo";
  return `#${protocolo.value.numero_protocolo_formatado || protocolo.value.id}`;
});


// MUDANÇA 5: Simplifique o onMounted
</script>

<style lang="scss" scoped>
.compact-header {
  min-height: 56px;
  border-bottom: 1px solid var(--border-color);
}

.protocol-badge-compact {
  margin-right: 8px;
}

.compact-tabs {
  background: transparent;

  .compact-tab {
    min-height: 40px;
    padding: 0;
    transition: all var(--transition);

    &:hover {
      background: rgba(var(--primary-rgb), 0.05);
    }

    &.q-tab--active {
      background: rgba(var(--primary-rgb), 0.1);

      .tab-content-compact {
        .q-icon {
          color: var(--primary);
        }

        .tab-label-compact {
          color: var(--primary);
          font-weight: 600;
        }
      }
    }

    .tab-content-compact {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      position: relative;

      .q-icon {
        color: var(--text-secondary);
        transition: color 0.2s ease;
      }

      .tab-label-compact {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--text-secondary);
        transition: all 0.2s ease;
      }

      .tab-badge-compact {
        margin-left: 4px;
      }
    }
  }
}

.protocol-content-compact {
  min-height: calc(100vh - 120px);
  padding-bottom: 60px;
}

.compact-footer {
  border-top: 1px solid var(--border-color);
  min-height: 60px;
}

.financial-summary-compact {
  .summary-item-compact {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  .compact-header {
    min-height: 52px;
  }

  .compact-tabs {
    .compact-tab {
      min-height: 36px;

      .tab-content-compact {
        padding: 6px 8px;
        gap: 4px;

        .tab-label-compact {
          font-size: 0.75rem;
        }
      }
    }
  }

  .financial-summary-compact {
    .row {
      gap: 8px;
    }

    .summary-item-compact {
      font-size: 0.8rem;
    }
  }
}

@media (max-width: 480px) {
  .compact-tabs {
    .compact-tab {
      .tab-content-compact {
        .tab-label-compact {
          display: none;
        }

        .q-icon {
          font-size: 18px;
        }
      }
    }
  }

  .financial-summary-compact {
    .row {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
}
</style>