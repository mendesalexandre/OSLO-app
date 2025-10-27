<template>
  <modal v-model="showModalImportacaoDoi" tamanho="lg" titulo="Sincronização de DOIs da Receita Federal">
    <q-card class="w-full" bordered>
      <!-- Status do Token -->
      <q-card-section class="no-padding">
        <q-banner dense inline-actions :class="tokenValido ? 'text-positive' : 'text-negative'">
          {{ tokenValido ? 'Token DOI válido' : 'Token DOI inválido ou não configurado' }}

          <template v-slot:action>
            <q-btn outline @click="verificarToken" :loading="verificandoToken" label="Verificar" />
          </template>
        </q-banner>
        <q-separator />
        <q-markup-table flat bordered square style="border: none;">
          <tr>
            <td>Nome do Responsável </td>
            <td>{{ dadosToken?.dados?.idToken?.name }} </td>
          </tr>
          <tr>
            <td>CPF do Responsável </td>
            <td>{{ formatarCpfCnpj(dadosToken?.dados?.cpfUsuario) }} </td>
          </tr>
          <tr>
            <td>CNPJ de Atuação </td>
            <td>{{ formatarCpfCnpj(dadosToken?.dados?.cnpjAtuacao) }} </td>
          </tr>
        </q-markup-table>


        <!-- <q-banner :class=" tokenValido ? 'text-positive' : 'text-negative'"
          :icon=" tokenValido ? 'eva-checkmark-circle-outline' : 'eva-alert-circle-outline'">
          {{ tokenValido ? 'Token DOI válido' : 'Token DOI inválido ou não configurado' }}
          <template v-slot:action>
            <q-btn flat @click=" verificarToken" :loading="verificandoToken" label="Verificar" size="sm" />
</template>
</q-banner> -->
      </q-card-section>

      <q-separator />

      <!-- Configurações da Importação -->
      <q-card-section>
        <div class="text-subtitle2 text-uppercase q-mb-md">
          Configurações da Sincronização
        </div>

        <div class="row q-col-gutter-md">
          <!-- Período -->
          <div class="col-md-6 col-12">
            <v-label label="Data Início" />
            <q-input v-model="loteForm.dataInicio" type="date" outlined dense
              :rules="[(val) => !!val || 'Campo obrigatório']" />
          </div>
          <div class="col-md-6 col-12">
            <v-label label="Data Fim" />
            <q-input v-model="loteForm.dataFim" type="date" outlined dense :rules="[
              (val) => !!val || 'Campo obrigatório',
              (val) => val >= loteForm.dataInicio || 'Data fim deve ser maior que data início',
            ]" />
          </div>

          <!-- Configurações avançadas -->
          <div class="col-md-4 col-12">
            <v-label label="Registros por página" />
            <q-input v-model.number="loteForm.pageSize" type="number" outlined dense :min="100" :max="5000"
              :rules="[(val) => val >= 100 && val <= 5000 || 'Entre 100 e 5000']" />
          </div>
          <div class="col-md-4 col-12">
            <v-label label="Tamanho do batch" />
            <q-input v-model.number="loteForm.batchSize" type="number" outlined dense :min="100" :max="5000"
              :rules="[(val) => val >= 100 && val <= 5000 || 'Entre 100 e 5000']" />
          </div>
          <div class="col-md-4 col-12">
            <v-label label="Anos para buscar" />
            <q-input v-model.number="loteForm.anos" type="number" outlined dense :min="1" :max="10"
              :rules="[(val) => val >= 1 && val <= 10 || 'Entre 1 e 10 anos']" />
          </div>

          <!-- Opções -->
          <div class="col-md-6 col-12">
            <q-toggle v-model="loteForm.porMes" label="Processar mês a mês (recomendado)" color="primary" />
          </div>
          <div class="col-md-6 col-12">
            <q-toggle v-model="loteForm.dryRun" label="Apenas simular (Dry Run)" color="orange" />
          </div>
        </div>
      </q-card-section>

      <!-- Progresso da Importação -->
      <q-card-section v-if="progresso.ativo || logs.length > 0">
        <q-separator class="q-mb-md" />
        <div class="text-subtitle2 text-uppercase q-mb-md">
          {{ progresso.ativo ? 'Progresso da Sincronização' : 'Última Sincronização' }}
        </div>

        <q-linear-progress v-if="progresso.ativo" :value="progresso.percentual / 100" color="primary" size="20px"
          class="q-mb-md">
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="primary" :label="progresso.percentual + '%'" />
          </div>
        </q-linear-progress>

        <div v-if="progresso.mensagem" class="text-body2 q-mb-md">
          {{ progresso.mensagem }}
        </div>

        <!-- Estatísticas da importação atual -->
        <div v-if="estatisticasAtual" class="row q-gutter-md q-mb-md">
          <q-chip color="primary" text-color="white" icon="eva-file-text-outline">
            {{ estatisticasAtual.totalProcessados || 0 }} processados
          </q-chip>
          <q-chip color="positive" text-color="white" icon="eva-checkmark-outline">
            {{ estatisticasAtual.batchsCriados || 0 }} batches
          </q-chip>
          <q-chip v-if="estatisticasAtual.tempoDecorrido" color="info" text-color="white" icon="eva-clock-outline">
            {{ estatisticasAtual.tempoDecorrido }}
          </q-chip>
        </div>

        <!-- Logs -->
        <q-scroll-area v-if="logs.length > 0" style="height: 200px;" class="bg-grey-1 q-pa-sm rounded-borders">
          <div v-for="(log, index) in logs" :key="index" class="q-mb-xs text-caption">
            <q-chip :color="getLogColor(log.tipo)" text-color="white" size="sm" dense>
              {{ log.timestamp }}
            </q-chip>
            {{ log.mensagem }}
          </div>
        </q-scroll-area>

        <!-- Botão para ver logs completos -->
        <div v-if="logs.length > 10" class="text-center q-mt-sm">
          <q-btn flat size="sm" @click="mostrarLogsCompletos = !mostrarLogsCompletos"
            :label="mostrarLogsCompletos ? 'Ocultar logs' : `Ver todos os ${logs.length} logs`" />
        </div>
      </q-card-section>

      <!-- Estatísticas Gerais -->
      <q-card-section v-if="estatisticas && !progresso.ativo">
        <q-separator class="q-mb-md" />
        <div class="text-subtitle2 text-uppercase q-mb-md">
          Estatísticas Gerais
        </div>

        <div class="row q-gutter-md">
          <div class="col">
            <q-card flat bordered class="text-center q-pa-md">
              <div class="text-h4 text-primary">{{ estatisticas.total_dois || 0 }}</div>
              <div class="text-caption">Total de DOIs</div>
            </q-card>
          </div>
          <div class="col">
            <q-card flat bordered class="text-center q-pa-md">
              <div class="text-h4 text-positive">{{ estatisticas.dois_hoje || 0 }}</div>
              <div class="text-caption">Hoje</div>
            </q-card>
          </div>
          <div class="col">
            <q-card flat bordered class="text-center q-pa-md">
              <div class="text-h4 text-info">{{ estatisticas.dois_semana || 0 }}</div>
              <div class="text-caption">Esta Semana</div>
            </q-card>
          </div>
        </div>

        <div v-if="estatisticas.ultima_importacao" class="q-mt-md text-body2">
          <strong>Última importação:</strong> {{ estatisticas.ultima_importacao }}
        </div>
      </q-card-section>

      <!-- Dialog de logs completos -->
      <q-dialog v-model="mostrarLogsCompletos">
        <q-card style="width: 80vw; max-width: 800px;">
          <q-card-section>
            <div class="text-h6">Logs Completos da Sincronização</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-scroll-area style="height: 400px;">
              <div v-for="(log, index) in logs" :key="index" class="q-mb-xs text-caption">
                <q-chip :color="getLogColor(log.tipo)" text-color="white" size="sm">
                  {{ log.timestamp }}
                </q-chip>
                {{ log.mensagem }}
              </div>
            </q-scroll-area>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Fechar" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>

    <template #rodape>
      <div class="flex justify-between q-gutter-sm">
        <div>
          <q-btn label="Cancelar" color="red-8" outline />
        </div>

        <div>
          <div class="q-gutter-sm">
            <q-btn outline label="Ver Estatísticas" color="info" @click="obterEstatisticas" :loading="carregandoStats"
              icon="eva-bar-chart-outline" :disable="progresso.ativo" />
            <q-btn outline label="Sincronizar" color="blue-9" @click="sincronizarDeclaracaoReceita" :loading="loading"
              icon="eva-cloud-download-outline"
              :disable="!tokenValido || !loteForm.dataInicio || !loteForm.dataFim || progresso.ativo" />
          </div>
          <!-- <q-btn label="Background" color="secondary" @click="sincronizarAsync" :loading="loadingAsync"
          icon="eva-clock-outline"
          :disable="!tokenValido || !loteForm.dataInicio || !loteForm.dataFim || progresso.ativo" /> -->
        </div>
      </div>
    </template>
  </modal>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDoiStore } from "src/stores/doi";
import { ref, onMounted, onUnmounted } from "vue";
import { api } from "src/boot/axios";
import { formatarCpfCnpj } from "src/Utils";

const showModalImportacaoDoi = defineModel({ default: false });
const doiStore = useDoiStore();

const $q = useQuasar();
const loading = ref(false);
const loadingAsync = ref(false);
const carregandoStats = ref(false);
const verificandoToken = ref(false);
const tokenValido = ref(false);
const dadosToken = ref(null);
const mostrarLogsCompletos = ref(false);

// Estado do progresso
const progresso = ref({
  ativo: false,
  percentual: 0,
  mensagem: '',
  iniciado: null
});

const logs = ref([]);
const estatisticas = ref(null);
const estatisticasAtual = ref({
  totalProcessados: 0,
  batchsCriados: 0,
  tempoDecorrido: ''
});

// Formulário
const loteForm = ref({
  dataInicio: "",
  dataFim: "",
  pageSize: 1000,
  batchSize: 1000,
  anos: 5,
  porMes: true,
  dryRun: false
});

// Controle de polling para jobs assíncronos
let pollingInterval = null;

// Métodos
const verificarToken = async () => {
  verificandoToken.value = true;
  try {
    const response = await api.get('/declaracao-imobiliaria/token/verificar');
    tokenValido.value = response.data.token_valido;
    dadosToken.value = response.data;

    // $q.notify({
    //   color: tokenValido.value ? 'positive' : 'negative',
    //   message: response.data.message,
    //   icon: tokenValido.value ? 'eva-checkmark-circle-outline' : 'eva-alert-circle-outline',
    //   position: 'top-right'
    // });
  } catch (error) {
    tokenValido.value = false;
    // $q.notify({
    //   color: 'negative',
    //   message: 'Erro ao verificar token: ' + (error.response?.data?.message || error.message),
    //   icon: 'eva-alert-circle-outline',
    //   position: 'top-right'
    // });
  } finally {
    verificandoToken.value = false;
  }
};

const obterEstatisticas = async () => {
  carregandoStats.value = true;
  try {
    const response = await api.get('/declaracao-imobiliaria/importacao/estatisticas');
    if (response.data.success) {
      estatisticas.value = response.data.data;
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar estatísticas',
      icon: 'eva-alert-circle-outline',
      position: 'top-right'
    });
  } finally {
    carregandoStats.value = false;
  }
};

const sincronizarDeclaracaoReceita = async () => {
  loading.value = true;
  logs.value = [];
  progresso.value = {
    ativo: true,
    percentual: 0,
    mensagem: 'Iniciando sincronização...',
    iniciado: new Date()
  };
  estatisticasAtual.value = { totalProcessados: 0, batchsCriados: 0, tempoDecorrido: '' };

  // Iniciar timer para tempo decorrido
  const timer = setInterval(atualizarTempoDecorrido, 1000);

  try {
    const payload = {
      page_size: loteForm.value.pageSize,
      anos: loteForm.value.anos,
      batch_size: loteForm.value.batchSize,
      por_mes: loteForm.value.porMes,
      dry_run: loteForm.value.dryRun
    };

    const response = await api.post('/declaracao-imobiliaria/importar/site-receita', payload);

    if (response.data.success) {
      // Processar logs retornados
      if (response.data.data.logs) {
        logs.value = response.data.data.logs.map(log => ({
          ...log,
          timestamp: log.timestamp || new Date().toLocaleTimeString()
        }));
      }

      // Processar dados de progresso
      if (response.data.data.progressos) {
        processarProgressos(response.data.data.progressos);
      }

      progresso.value = {
        ativo: false,
        percentual: 100,
        mensagem: 'Sincronização concluída com sucesso!',
        iniciado: progresso.value.iniciado
      };

      estatisticasAtual.value.totalProcessados = response.data.data.total_importados;

      $q.notify({
        color: 'positive',
        message: response.data.message,
        icon: 'eva-checkmark-circle-outline',
        position: 'top-right',
        timeout: 5000
      });

      // Atualizar estatísticas gerais
      await obterEstatisticas();
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    progresso.value.ativo = false;
    adicionarLog('error', 'Erro na sincronização: ' + (error.response?.data?.message || error.message));

    $q.notify({
      color: 'negative',
      message: 'Erro na sincronização: ' + (error.response?.data?.message || error.message),
      icon: 'eva-alert-circle-outline',
      position: 'top-right',
      timeout: 10000
    });
  } finally {
    loading.value = false;
    clearInterval(timer);
  }
};

const sincronizarAsync = async () => {
  loadingAsync.value = true;

  try {
    const payload = {
      page_size: loteForm.value.pageSize,
      anos: loteForm.value.anos,
      batch_size: loteForm.value.batchSize,
      por_mes: loteForm.value.porMes,
      dry_run: loteForm.value.dryRun
    };

    const response = await api.post('/declaracao-imobiliaria/importar/site-receita-async', payload);

    if (response.data.success) {
      progresso.value = {
        ativo: true,
        percentual: 0,
        mensagem: 'Sincronização iniciada em background...',
        iniciado: new Date()
      };

      adicionarLog('info', 'Sincronização iniciada em background');

      $q.notify({
        color: 'positive',
        message: response.data.message,
        icon: 'eva-clock-outline',
        position: 'top-right',
        timeout: 5000
      });

      // Iniciar polling para acompanhar progresso (se você implementar endpoint de status)
      // iniciarPollingStatus();
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Erro ao iniciar sincronização: ' + (error.response?.data?.message || error.message),
      icon: 'eva-alert-circle-outline',
      position: 'top-right'
    });
  } finally {
    loadingAsync.value = false;
  }
};

const processarProgressos = (progressos) => {
  progressos.forEach(prog => {
    switch (prog.tipo) {
      case 'mes_iniciado':
        progresso.value.percentual = prog.progresso;
        progresso.value.mensagem = `Processando ${prog.periodo}... (${prog.mes_atual}/${prog.total_meses})`;
        adicionarLog('info', `Iniciando processamento: ${prog.periodo}`);
        break;

      case 'mes_concluido':
        adicionarLog('success', `${prog.periodo}: ${prog.dois_processados} DOIs processados`);
        break;

      case 'batch_criado':
        estatisticasAtual.value.batchsCriados++;
        adicionarLog('info', `Batch #${prog.batch_number} criado com ${prog.dois_count} DOIs`);
        break;

      case 'pagina_processada':
        const percentualPagina = (prog.pagina_atual / prog.total_paginas) * 100;
        progresso.value.mensagem = `Página ${prog.pagina_atual}/${prog.total_paginas} - ${prog.elementos_pagina} elementos`;
        break;
    }
  });
};

const adicionarLog = (tipo, mensagem) => {
  logs.value.push({
    tipo,
    mensagem,
    timestamp: new Date().toLocaleTimeString()
  });

  // Limitar logs para performance (manter últimos 100)
  if (logs.value.length > 100) {
    logs.value = logs.value.slice(-100);
  }
};

const atualizarTempoDecorrido = () => {
  if (progresso.value.iniciado) {
    const agora = new Date();
    const diferenca = agora - progresso.value.iniciado;
    const minutos = Math.floor(diferenca / 60000);
    const segundos = Math.floor((diferenca % 60000) / 1000);
    estatisticasAtual.value.tempoDecorrido = `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }
};

const getLogColor = (tipo) => {
  const cores = {
    error: 'negative',
    warning: 'orange',
    success: 'positive',
    info: 'primary'
  };
  return cores[tipo] || 'grey';
};

// Lifecycle
onMounted(() => {
  verificarToken();
  obterEstatisticas();
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

// Funções existentes mantidas para compatibilidade
const onPreviewLoteClick = async () => {
  await onPreviewLote(loteForm.value.dataInicio, loteForm.value.dataFim);
};

const onPreviewLote = async (dataInicio, dataFim) => {
  loading.value = true;
  try {
    const response = await doiStore.previewLote(dataInicio, dataFim);

    $q.dialog({
      title: "Preview do Lote",
      message: `
        <div class="q-mb-md">
          <strong>Período:</strong> ${response.periodo}<br>
          <strong>DOIs válidas:</strong> ${response.total_validas}<br>
          <strong>DOIs com problemas:</strong> ${response.total_problemas}
        </div>
        ${response.total_validas > 0
          ? "Deseja gerar o lote?"
          : "Não há DOIs válidas no período."
        }
      `,
      html: true,
      cancel: response.total_validas > 0,
      persistent: true,
      ok:
        response.total_validas > 0
          ? {
            label: "Gerar Lote",
            color: "primary",
          }
          : {
            label: "OK",
            color: "grey",
          },
    }).onOk(async () => {
      if (response.total_validas > 0) {
        await onCriarLote(dataInicio, dataFim);
      }
    });
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao fazer preview do lote",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  } finally {
    loading.value = false;
  }
};

const onCriarLote = async (dataInicio, dataFim) => {
  loading.value = true;
  try {
    const response = await doiStore.criarLote(dataInicio, dataFim);

    $q.notify({
      color: "positive",
      message: `Lote criado com sucesso! ${response.total_dois} Declarações incluídas.`,
      icon: "eva-checkmark-circle-outline",
      position: "top-right",
      actions: [
        {
          label: "Download",
          color: "white",
          handler: () => {
            window.open(response.download_url, "_blank");
          },
        },
      ],
    });

    // Recarregar lista
    // await onAtualizar();
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Erro ao criar lote",
      icon: "eva-alert-circle-outline",
      position: "top-right",
    });
  } finally {
    loading.value = false;
  }
};
</script>