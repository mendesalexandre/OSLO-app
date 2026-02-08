<template>
  <q-page padding>
    <div class="oslo-page-header">
      <div class="col">
        <h1 class="oslo-page-title">Permissões de Usuários</h1>
        <p class="oslo-page-subtitle">Gerencie grupos e permissões individuais de cada usuário</p>
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
              placeholder="Buscar por nome ou e-mail..."
              clearable
              @update:model-value="buscarDebounce"
            >
              <template #prepend><q-icon name="search" /></template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela -->
    <q-card flat bordered>
      <q-table
        flat
        :rows="usuarios"
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
            <div class="text-caption oslo-text-secondary">{{ props.row.email }}</div>
          </q-td>
        </template>

        <template #body-cell-grupos="props">
          <q-td :props="props">
            <q-badge
              v-for="g in props.row.grupos"
              :key="g.id"
              :label="g.nome"
              color="primary"
              outline
              class="q-mr-xs q-mb-xs"
            />
            <span v-if="!props.row.grupos?.length" class="oslo-text-secondary text-caption">Nenhum</span>
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
              v-permissao="'USUARIO_PERMISSAO_EDITAR'"
              flat
              round
              dense
              icon="settings"
              color="grey-7"
              @click="abrirModal(props.row)"
            >
              <q-tooltip>Gerenciar Permissões</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width text-center q-py-xl oslo-text-secondary">
            <q-icon name="people" size="48px" class="q-mb-md" />
            <div class="text-h6">Nenhum usuário encontrado</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Modal -->
    <usuario-permissao-show
      v-model="showModal"
      :usuario="usuarioSelecionado"
      @salvo="carregarUsuarios"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar, debounce } from "quasar";
import { useUsuarioPermissaoStore } from "src/stores/usuario-permissao";
import UsuarioPermissaoShow from "./Show.vue";

defineOptions({ name: "UsuariosPermissoesIndex" });

const $q = useQuasar();
const store = useUsuarioPermissaoStore();

const usuarios = ref([]);
const loading = ref(false);
const busca = ref("");
const showModal = ref(false);
const usuarioSelecionado = ref(null);

const colunas = [
  { name: "nome", label: "Usuário", field: "nome", align: "left", sortable: true },
  { name: "grupos", label: "Grupos", align: "left" },
  { name: "is_ativo", label: "Status", field: "is_ativo", align: "center", style: "width: 100px" },
  { name: "acoes", label: "Ações", align: "center", style: "width: 100px" },
];

const carregarUsuarios = async () => {
  loading.value = true;
  try {
    const params = {};
    if (busca.value) params.busca = busca.value;
    const resultado = await store.listarUsuarios(params);
    usuarios.value = resultado?.data ?? resultado ?? [];
  } catch {
    $q.notify({ type: "negative", message: "Erro ao carregar usuários." });
  } finally {
    loading.value = false;
  }
};

const buscarDebounce = debounce(carregarUsuarios, 400);

const abrirModal = (usuario) => {
  usuarioSelecionado.value = usuario;
  showModal.value = true;
};

onMounted(carregarUsuarios);
</script>

<style lang="scss" scoped>
.oslo-page-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>
