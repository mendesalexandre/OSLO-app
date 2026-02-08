<template>
  <q-page padding>
    <div class="oslo-page-header">
      <div class="col">
        <h1 class="oslo-page-title">Grupos de Permissão</h1>
        <p class="oslo-page-subtitle">Gerencie os grupos e suas permissões</p>
      </div>
      <div class="col-auto">
        <q-btn
          v-permissao="'GRUPO_CRIAR'"
          color="primary"
          unelevated
          no-caps
          icon="add"
          label="Novo Grupo"
          @click="abrirModal()"
        />
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
              placeholder="Buscar por nome ou descrição..."
              clearable
              @update:model-value="buscarDebounce"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela -->
    <q-card flat bordered>
      <q-table
        flat
        :rows="grupos"
        :columns="colunas"
        :loading="loading"
        row-key="id"
        :rows-per-page-options="[10, 20, 50]"
      >
        <template #header-cell="props">
          <q-th :props="props" class="tabela-cabecalho">
            {{ props.col.label }}
          </q-th>
        </template>

        <template #body-cell-nome="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.nome }}</div>
            <div class="text-caption oslo-text-secondary">{{ props.row.descricao }}</div>
          </q-td>
        </template>

        <template #body-cell-permissoes_count="props">
          <q-td :props="props" class="text-center">
            <q-badge color="primary" :label="props.row.permissoes_count || 0" />
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

        <template #body-cell-acoes="props">
          <q-td :props="props" class="text-center">
            <q-btn
              v-permissao="'GRUPO_EDITAR'"
              flat
              round
              dense
              icon="edit"
              color="grey-7"
              @click="abrirModal(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              v-permissao="'GRUPO_EXCLUIR'"
              flat
              round
              dense
              icon="delete"
              color="grey-7"
              @click="confirmarExclusao(props.row)"
            >
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width text-center q-py-xl oslo-text-secondary">
            <q-icon name="groups" size="48px" class="q-mb-md" />
            <div class="text-h6">Nenhum grupo encontrado</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Modal -->
    <grupo-show v-model="showModal" :grupo-id="grupoSelecionadoId" @salvo="carregarGrupos" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useGrupoStore } from "src/stores/grupo";
import { debounce } from "quasar";
import GrupoShow from "./Show.vue";

defineOptions({ name: "GruposIndex" });

const $q = useQuasar();
const grupoStore = useGrupoStore();

const grupos = ref([]);
const loading = ref(false);
const busca = ref("");
const showModal = ref(false);
const grupoSelecionadoId = ref(null);

const colunas = [
  { name: "nome", label: "Nome", field: "nome", align: "left", sortable: true },
  { name: "permissoes_count", label: "Permissões", field: "permissoes_count", align: "center", style: "width: 120px" },
  { name: "is_ativo", label: "Status", field: "is_ativo", align: "center", style: "width: 100px" },
  { name: "acoes", label: "Ações", align: "center", style: "width: 120px" },
];

const carregarGrupos = async () => {
  loading.value = true;
  try {
    const params = {};
    if (busca.value) params.busca = busca.value;
    grupos.value = await grupoStore.index(params);
  } catch {
    $q.notify({ type: "negative", message: "Erro ao carregar grupos" });
  } finally {
    loading.value = false;
  }
};

const buscarDebounce = debounce(carregarGrupos, 400);

const abrirModal = (grupo = null) => {
  grupoSelecionadoId.value = grupo?.id || null;
  showModal.value = true;
};

const confirmarExclusao = (grupo) => {
  if (grupo.nome === "Administrador") {
    $q.notify({ type: "warning", message: "O grupo Administrador não pode ser excluído." });
    return;
  }

  $q.dialog({
    title: "Confirmar Exclusão",
    message: `Deseja excluir o grupo "${grupo.nome}"?`,
    cancel: { label: "Cancelar", flat: true },
    ok: { label: "Excluir", color: "negative" },
    persistent: true,
  }).onOk(async () => {
    try {
      await grupoStore.destroy(grupo.id);
      $q.notify({ type: "positive", message: "Grupo excluído com sucesso." });
      carregarGrupos();
    } catch {
      $q.notify({ type: "negative", message: "Erro ao excluir grupo." });
    }
  });
};

onMounted(carregarGrupos);
</script>

<style lang="scss" scoped>
.oslo-page-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>
