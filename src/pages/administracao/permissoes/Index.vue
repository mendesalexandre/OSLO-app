<template>
  <q-page padding>
    <div class="oslo-page-header">
      <div class="col">
        <h1 class="oslo-page-title">Permissões do Sistema</h1>
        <p class="oslo-page-subtitle">Visualize as permissões disponíveis agrupadas por módulo</p>
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="q-py-sm">
        <div class="row q-col-gutter-md items-center">
          <div class="col-md-6 col-12">
            <q-input
              v-model="busca"
              outlined
              dense
              placeholder="Buscar permissão..."
              clearable
            >
              <template #prepend><q-icon name="search" /></template>
            </q-input>
          </div>
          <div class="col-md-3 col-12">
            <q-select
              v-model="moduloFiltro"
              :options="modulos"
              outlined
              dense
              clearable
              placeholder="Filtrar por módulo"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading -->
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <!-- Lista por módulo -->
    <div v-else>
      <q-card v-for="modulo in modulosFiltrados" :key="modulo.nome" flat bordered class="q-mb-md">
        <q-expansion-item default-opened header-class="q-pa-md">
          <template #header>
            <q-item-section>
              <q-item-label class="text-weight-medium" style="font-size: var(--font-size-base)">
                {{ modulo.nome }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge color="primary" :label="modulo.permissoes.length" />
            </q-item-section>
          </template>

          <q-table
            flat
            :rows="modulo.permissoes"
            :columns="colunas"
            row-key="id"
            hide-pagination
            :rows-per-page-options="[0]"
            dense
          >
            <template #header-cell="props">
              <q-th :props="props" class="tabela-cabecalho">
                {{ props.col.label }}
              </q-th>
            </template>

            <template #body-cell-nome="props">
              <q-td :props="props">
                <code class="text-primary" style="font-size: var(--font-size-xs)">{{ props.row.nome }}</code>
              </q-td>
            </template>

            <template #body-cell-is_ativo="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  :color="props.row.is_ativo ? 'positive' : 'grey-5'"
                  :label="props.row.is_ativo ? 'Ativo' : 'Inativo'"
                />
              </q-td>
            </template>
          </q-table>
        </q-expansion-item>
      </q-card>

      <div v-if="!modulosFiltrados.length" class="text-center q-py-xl oslo-text-secondary">
        <q-icon name="vpn_key" size="48px" class="q-mb-md" />
        <div class="text-h6">Nenhuma permissão encontrada</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { usePermissaoStore } from "src/stores/permissao";

defineOptions({ name: "PermissoesIndex" });

const $q = useQuasar();
const permissaoStore = usePermissaoStore();

const loading = ref(false);
const busca = ref("");
const moduloFiltro = ref(null);
const modulos = ref([]);
const todasPermissoes = ref([]);

const colunas = [
  { name: "nome", label: "Identificador", field: "nome", align: "left" },
  { name: "descricao", label: "Descrição", field: "descricao", align: "left" },
  { name: "is_ativo", label: "Status", field: "is_ativo", align: "center", style: "width: 100px" },
];

const modulosAgrupados = computed(() => {
  const mapa = {};
  todasPermissoes.value.forEach((p) => {
    if (!mapa[p.modulo]) mapa[p.modulo] = { nome: p.modulo, permissoes: [] };
    mapa[p.modulo].permissoes.push(p);
  });
  return Object.values(mapa).sort((a, b) => a.nome.localeCompare(b.nome));
});

const modulosFiltrados = computed(() => {
  let resultado = modulosAgrupados.value;

  if (moduloFiltro.value) {
    resultado = resultado.filter((m) => m.nome === moduloFiltro.value);
  }

  if (busca.value) {
    const termo = busca.value.toLowerCase();
    resultado = resultado
      .map((m) => ({
        ...m,
        permissoes: m.permissoes.filter(
          (p) =>
            p.nome.toLowerCase().includes(termo) ||
            (p.descricao && p.descricao.toLowerCase().includes(termo))
        ),
      }))
      .filter((m) => m.permissoes.length > 0);
  }

  return resultado;
});

const carregarDados = async () => {
  loading.value = true;
  try {
    const [perms, mods] = await Promise.all([
      permissaoStore.listarTodas(),
      permissaoStore.listarModulos(),
    ]);
    todasPermissoes.value = perms;
    modulos.value = mods;
  } catch {
    $q.notify({ type: "negative", message: "Erro ao carregar permissões." });
  } finally {
    loading.value = false;
  }
};

onMounted(carregarDados);
</script>

<style lang="scss" scoped>
.oslo-page-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>
