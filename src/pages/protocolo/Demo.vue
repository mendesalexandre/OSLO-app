<template>
  <q-page>
    <!-- Header compacto -->
    <q-header class="text-dark bg-white shadow-sm compact-header" elevated>
      <q-toolbar style="min-height: 40px;">
        <div class="row items-center full-width q-gutter-sm">
          <!-- Título e Tabs na mesma linha -->
          <div class="protocolo-titulo">
            #2026/000123
          </div>

          <!-- TABS na mesma linha do título -->
          <div class="tabs-inline">
            <q-tabs v-model="tab" align="left" active-color="primary" indicator-color="primary">
              <q-tab name="geral" label="Informações Gerais" />
              <q-tab name="atos">
                <div class="tab-with-badge">
                  <span>Atos</span>
                  <q-chip label="3" color="orange-3" text-color="orange-8" size="xs"
                    class="rounded-borders q-ml-sm" />
                </div>
              </q-tab>
              <q-tab name="financeiro">
                <div class="tab-with-badge">
                  <span>Financeiro</span>
                  <q-chip label="!" color="red-3" text-color="red-8" size="xs"
                    class="rounded-borders q-ml-sm" />
                </div>
              </q-tab>
            </q-tabs>
          </div>
          <q-space />
          <!-- Ações principais compactas -->
          <div class="row q-gutter-xs">
            <q-btn color="green-6" size="sm" icon="eva-credit-card-outline"
              class="rounded-borders" dense>
              <q-tooltip>Receber Pagamento</q-tooltip>
            </q-btn>

            <q-btn color="blue-6" size="sm" icon="eva-printer-outline" outline
              class="rounded-borders" dense>
              <q-tooltip>Imprimir</q-tooltip>
            </q-btn>

            <q-btn icon="eva-more-vertical-outline" flat round size="sm" color="grey-7">
              <q-menu class="rounded-borders">
                <q-list dense>
                  <q-item clickable class="q-py-xs">
                    <q-item-section avatar>
                      <q-icon name="eva-copy-outline" size="16px" />
                    </q-item-section>
                    <q-item-section>
                      <div class="text-caption">Duplicar</div>
                    </q-item-section>
                  </q-item>

                  <q-item clickable class="q-py-xs">
                    <q-item-section avatar>
                      <q-icon name="eva-archive-outline" size="16px" />
                    </q-item-section>
                    <q-item-section>
                      <div class="text-caption">Arquivar</div>
                    </q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable class="text-negative q-py-xs">
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
    <div class="protocolo-content-compact q-pa-md">
      <q-tab-panels v-model="tab" animated>
        <!-- Tab Geral -->
        <q-tab-panel name="geral">
          <div class="row q-col-gutter-md">
            <!-- Informações Básicas -->
            <div class="col-12 col-md-8">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Informações do Protocolo</div>

                  <!-- Grid de Cards com Ícones -->
                  <div class="info-grid">
                    <!-- Número -->
                    <div class="info-card">
                      <q-icon name="fa-duotone fa-hashtag" size="20px" class="info-icon" />
                      <div class="info-label">Número</div>
                      <div class="info-value">#2026/000123</div>
                    </div>

                    <!-- Apresentante -->
                    <div class="info-card">
                      <q-icon name="fa-duotone fa-user" size="20px" class="info-icon" />
                      <div class="info-label">Apresentante</div>
                      <div class="info-value">João da Silva Santos</div>
                    </div>

                    <!-- Data -->
                    <div class="info-card">
                      <q-icon name="fa-duotone fa-calendar" size="20px" class="info-icon" />
                      <div class="info-label">Data de Abertura</div>
                      <div class="info-value">08/02/2026 14:30</div>
                    </div>

                    <!-- CPF/CNPJ -->
                    <div class="info-card">
                      <q-icon name="fa-duotone fa-id-card" size="20px" class="info-icon" />
                      <div class="info-label">CPF/CNPJ</div>
                      <div class="info-value">123.456.789-00</div>
                    </div>

                    <!-- Tipo -->
                    <div class="info-card">
                      <q-icon name="fa-duotone fa-file-lines" size="20px" class="info-icon" />
                      <div class="info-label">Tipo</div>
                      <div class="info-value">
                        <q-chip size="sm" color="blue-2" text-color="blue-8" class="q-mt-xs">Normal</q-chip>
                      </div>
                    </div>

                    <!-- Status -->
                    <div class="info-card">
                      <q-icon name="fa-duotone fa-circle-dot" size="20px" class="info-icon" />
                      <div class="info-label">Status</div>
                      <div class="info-value">
                        <q-chip size="sm" color="orange-2" text-color="orange-8" class="q-mt-xs">Em Andamento</q-chip>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Observações -->
              <q-card flat bordered class="q-mt-md">
                <q-card-section>
                  <div class="text-h6 q-mb-md">Observações</div>
                  <q-input
                    v-model="observacao"
                    type="textarea"
                    outlined
                    rows="4"
                    placeholder="Adicione observações sobre este protocolo..."
                  />
                </q-card-section>
              </q-card>
            </div>

            <!-- Timeline -->
            <div class="col-12 col-md-4">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Histórico</div>

                  <q-timeline color="primary">
                    <q-timeline-entry
                      title="Protocolo Criado"
                      subtitle="08/02/2026 14:30"
                      icon="eva-plus-circle-outline"
                    >
                      <div class="text-caption text-grey-7">
                        Por: Maria Silva
                      </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                      title="Atos Adicionados"
                      subtitle="08/02/2026 14:35"
                      icon="eva-file-add-outline"
                    >
                      <div class="text-caption text-grey-7">
                        3 atos adicionados
                      </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                      title="Pagamento Parcial"
                      subtitle="08/02/2026 15:00"
                      icon="eva-credit-card-outline"
                      color="green"
                    >
                      <div class="text-caption text-grey-7">
                        R$ 150,00 recebido
                      </div>
                    </q-timeline-entry>
                  </q-timeline>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <!-- Tab Atos -->
        <q-tab-panel name="atos">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center q-mb-md">
                <div class="text-h6">Atos do Registro</div>
                <q-space />
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar Ato"
                  size="sm"
                  unelevated
                />
              </div>

              <q-table
                flat
                :rows="atos"
                :columns="atosColumns"
                row-key="id"
                :pagination="{ rowsPerPage: 10 }"
              >
                <template v-slot:body-cell-valor="props">
                  <q-td :props="props">
                    <span class="text-weight-bold">{{ props.value }}</span>
                  </q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn flat round dense size="sm" icon="edit" color="grey-7" />
                    <q-btn flat round dense size="sm" icon="delete" color="negative" />
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- Tab Financeiro -->
        <q-tab-panel name="financeiro">
          <div class="row q-col-gutter-md">
            <!-- Resumo Financeiro -->
            <div class="col-12">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Resumo Financeiro</div>

                  <div class="row q-col-gutter-md">
                    <div class="col-3">
                      <q-card flat class="bg-blue-1">
                        <q-card-section>
                          <div class="text-caption text-grey-7">Total</div>
                          <div class="text-h5 text-weight-bold">R$ 450,00</div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-3">
                      <q-card flat class="bg-green-1">
                        <q-card-section>
                          <div class="text-caption text-grey-7">Pago</div>
                          <div class="text-h5 text-weight-bold text-green-8">R$ 150,00</div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-3">
                      <q-card flat class="bg-red-1">
                        <q-card-section>
                          <div class="text-caption text-grey-7">Desconto</div>
                          <div class="text-h5 text-weight-bold text-red-8">R$ 50,00</div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-3">
                      <q-card flat class="bg-orange-1">
                        <q-card-section>
                          <div class="text-caption text-grey-7">Restante</div>
                          <div class="text-h5 text-weight-bold text-primary">R$ 250,00</div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Pagamentos -->
            <div class="col-12">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-center q-mb-md">
                    <div class="text-h6">Pagamentos Recebidos</div>
                    <q-space />
                    <q-btn
                      color="green"
                      icon="add"
                      label="Receber Pagamento"
                      size="sm"
                      unelevated
                    />
                  </div>

                  <q-table
                    flat
                    :rows="pagamentos"
                    :columns="pagamentosColumns"
                    row-key="id"
                  >
                    <template v-slot:body-cell-valor="props">
                      <q-td :props="props">
                        <span class="text-weight-bold text-green-8">{{ props.value }}</span>
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Footer financeiro compacto -->
    <q-footer class="bg-white text-dark protocolo-footer" elevated>
      <q-card-section class="q-py-sm">
        <div class="row items-center justify-between">
          <!-- Resumo financeiro inline -->
          <div class="col">
            <div class="financial-summary-compact">
              <div class="row items-center q-gutter-md">
                <div class="summary-item-compact">
                  <span class="text-caption text-grey-6">Total:</span>
                  <span class="text-weight-bold text-grey-8 q-ml-xs">R$ 450,00</span>
                </div>

                <div class="summary-item-compact">
                  <span class="text-caption text-grey-6">Desconto:</span>
                  <span class="text-weight-medium text-red-6 q-ml-xs">-R$ 50,00</span>
                </div>

                <div class="summary-item-compact">
                  <span class="text-caption text-grey-6">Pago:</span>
                  <span class="text-weight-medium text-green-6 q-ml-xs">R$ 150,00</span>
                </div>

                <div class="summary-item-compact">
                  <span class="text-caption text-grey-6">Restante:</span>
                  <span class="text-weight-bold text-primary q-ml-xs">R$ 250,00</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Status visual -->
          <div class="col-auto">
            <q-chip label="Pendente" color="orange-3" text-color="orange-8" size="sm"
              class="rounded-borders" outline />
          </div>
        </div>
      </q-card-section>
    </q-footer>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

defineOptions({ name: 'ProtocoloDemo' });

const tab = ref('geral');
const observacao = ref('');

const atos = [
  { id: 1, codigo: '1.1.01', descricao: 'Registro de Escritura Pública', quantidade: 1, valor: 'R$ 250,00' },
  { id: 2, codigo: '1.1.02', descricao: 'Certidão de Registro', quantidade: 2, valor: 'R$ 100,00' },
  { id: 3, codigo: '1.1.03', descricao: 'Busca e Certidão', quantidade: 1, valor: 'R$ 100,00' },
];

const atosColumns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'center' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
];

const pagamentos = [
  { id: 1, data: '08/02/2026 15:00', forma: 'PIX', meio: 'Banco Inter', valor: 'R$ 150,00' },
];

const pagamentosColumns = [
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'forma', label: 'Forma', field: 'forma', align: 'left' },
  { name: 'meio', label: 'Meio', field: 'meio', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
];
</script>

<style lang="scss" scoped>
.compact-header {
  border-bottom: 1px solid var(--border-color);
}

.protocolo-titulo {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-color);
  text-transform: uppercase;
}

.tab-with-badge {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.protocolo-content-compact {
  min-height: calc(100vh - 160px);
  padding-bottom: 60px;
}

.protocolo-footer {
  border-top: 1px solid var(--border-color);
  box-shadow: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a !important;
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
    min-height: 88px;
  }

  .protocolo-content-compact {
    min-height: calc(100vh - 148px);
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
  .financial-summary-compact {
    .row {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
}

// Grid de Cards de Informações
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.info-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all var(--transition);
  position: relative;

  &:hover {
    border-color: var(--border-color-dark);
    box-shadow: var(--shadow-sm);
  }

  .info-icon {
    color: var(--primary);
    margin-bottom: 4px;
  }

  .info-label {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--text-muted);
  }

  .info-value {
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--text-color);
    line-height: 1.4;
  }
}
</style>
