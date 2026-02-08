<template>
  <modal v-model="model" :titulo="titulo" tamanho="lg">
    <q-tabs v-model="tab" no-caps class="q-mb-md" active-color="primary" indicator-color="primary" dense align="left">
      <q-tab name="dados" label="Dados" />
      <q-tab name="permissoes" label="Permissões" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <!-- Tab Dados -->
      <q-tab-panel name="dados" class="q-pa-none">
        <q-card flat bordered>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-md-8 col-12">
                <label class="oslo-label">Nome</label>
                <q-input v-model="form.nome" outlined dense placeholder="Nome do grupo" />
              </div>
              <div class="col-md-4 col-12">
                <label class="oslo-label">Ativo?</label>
                <q-toggle v-model="form.is_ativo" color="positive" />
              </div>
              <div class="col-12">
                <label class="oslo-label">Descrição</label>
                <q-input v-model="form.descricao" outlined dense type="textarea" rows="3" placeholder="Descrição do grupo" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Tab Permissões -->
      <q-tab-panel name="permissoes" class="q-pa-none">
        <q-card flat bordered>
          <q-card-section v-if="carregandoPermissoes" class="text-center q-py-xl">
            <q-spinner color="primary" size="40px" />
          </q-card-section>

          <q-card-section v-else>
            <q-input
              v-model="buscaPermissao"
              outlined
              dense
              placeholder="Filtrar permissões..."
              clearable
              class="q-mb-md"
            >
              <template #prepend><q-icon name="search" /></template>
            </q-input>

            <q-list>
              <q-expansion-item
                v-for="modulo in modulosFiltrados"
                :key="modulo.nome"
                :label="modulo.nome"
                :caption="`${permissoesSelecionadasPorModulo(modulo.nome)} / ${modulo.permissoes.length} selecionadas`"
                header-class="text-weight-medium"
                dense
              >
                <template #header>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ modulo.nome }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge
                      :color="permissoesSelecionadasPorModulo(modulo.nome) > 0 ? 'primary' : 'grey-4'"
                      :text-color="permissoesSelecionadasPorModulo(modulo.nome) > 0 ? 'white' : 'grey-7'"
                      :label="`${permissoesSelecionadasPorModulo(modulo.nome)}/${modulo.permissoes.length}`"
                    />
                  </q-item-section>
                </template>

                <q-card flat>
                  <q-card-section class="q-pt-none">
                    <q-checkbox
                      :model-value="todasSelecionadas(modulo.nome)"
                      :indeterminate-value="false"
                      label="Selecionar todas"
                      color="primary"
                      class="q-mb-sm text-weight-medium"
                      @update:model-value="toggleModulo(modulo.nome, $event)"
                    />
                    <div class="row q-col-gutter-sm">
                      <div v-for="perm in modulo.permissoes" :key="perm.id" class="col-md-6 col-12">
                        <q-checkbox
                          v-model="permissoesSelecionadas"
                          :val="perm.id"
                          :label="perm.descricao || perm.nome"
                          color="primary"
                          dense
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <template #rodape>
      <div class="flex justify-end q-gutter-sm">
        <q-btn label="Cancelar" flat no-caps color="grey-7" @click="model = false" />
        <q-btn label="Salvar" color="primary" unelevated no-caps icon="save" :loading="salvando" @click="salvar" />
      </div>
    </template>
  </modal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { useGrupoStore } from "src/stores/grupo";
import { usePermissaoStore } from "src/stores/permissao";

const props = defineProps({
  grupoId: { type: Number, default: null },
});

const emit = defineEmits(["salvo"]);
const model = defineModel({ default: false });

const $q = useQuasar();
const grupoStore = useGrupoStore();
const permissaoStore = usePermissaoStore();

const tab = ref("dados");
const salvando = ref(false);
const carregandoPermissoes = ref(false);
const buscaPermissao = ref("");

const form = ref({
  nome: "",
  descricao: "",
  is_ativo: true,
});

const todasPermissoes = ref([]);
const permissoesSelecionadas = ref([]);

const titulo = computed(() => (props.grupoId ? "Editar Grupo" : "Novo Grupo"));

const modulosAgrupados = computed(() => {
  const mapa = {};
  todasPermissoes.value.forEach((p) => {
    if (!mapa[p.modulo]) mapa[p.modulo] = { nome: p.modulo, permissoes: [] };
    mapa[p.modulo].permissoes.push(p);
  });
  return Object.values(mapa).sort((a, b) => a.nome.localeCompare(b.nome));
});

const modulosFiltrados = computed(() => {
  if (!buscaPermissao.value) return modulosAgrupados.value;
  const termo = buscaPermissao.value.toLowerCase();
  return modulosAgrupados.value
    .map((m) => ({
      ...m,
      permissoes: m.permissoes.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          (p.descricao && p.descricao.toLowerCase().includes(termo))
      ),
    }))
    .filter((m) => m.permissoes.length > 0);
});

const permissoesSelecionadasPorModulo = (modulo) => {
  const mod = modulosAgrupados.value.find((m) => m.nome === modulo);
  if (!mod) return 0;
  return mod.permissoes.filter((p) => permissoesSelecionadas.value.includes(p.id)).length;
};

const todasSelecionadas = (modulo) => {
  const mod = modulosAgrupados.value.find((m) => m.nome === modulo);
  if (!mod) return false;
  return mod.permissoes.every((p) => permissoesSelecionadas.value.includes(p.id));
};

const toggleModulo = (modulo, selecionado) => {
  const mod = modulosAgrupados.value.find((m) => m.nome === modulo);
  if (!mod) return;
  const ids = mod.permissoes.map((p) => p.id);
  if (selecionado) {
    permissoesSelecionadas.value = [...new Set([...permissoesSelecionadas.value, ...ids])];
  } else {
    permissoesSelecionadas.value = permissoesSelecionadas.value.filter((id) => !ids.includes(id));
  }
};

const carregarDados = async () => {
  carregandoPermissoes.value = true;
  try {
    todasPermissoes.value = await permissaoStore.listarTodas();

    if (props.grupoId) {
      const grupo = await grupoStore.show(props.grupoId);
      form.value = {
        nome: grupo.nome,
        descricao: grupo.descricao || "",
        is_ativo: grupo.is_ativo ?? true,
      };
      permissoesSelecionadas.value = (grupo.permissoes || []).map((p) => p.id);
    } else {
      form.value = { nome: "", descricao: "", is_ativo: true };
      permissoesSelecionadas.value = [];
    }
  } catch {
    $q.notify({ type: "negative", message: "Erro ao carregar dados." });
  } finally {
    carregandoPermissoes.value = false;
  }
};

const salvar = async () => {
  if (!form.value.nome?.trim()) {
    $q.notify({ type: "warning", message: "Informe o nome do grupo." });
    return;
  }

  salvando.value = true;
  try {
    let grupoId = props.grupoId;

    if (grupoId) {
      await grupoStore.update(grupoId, form.value);
    } else {
      const novo = await grupoStore.create(form.value);
      grupoId = novo.id;
    }

    await grupoStore.sincronizarPermissoes(grupoId, permissoesSelecionadas.value);

    $q.notify({ type: "positive", message: "Grupo salvo com sucesso." });
    model.value = false;
    emit("salvo");
  } catch (error) {
    const msg = error?.response?.data?.message || "Erro ao salvar grupo.";
    $q.notify({ type: "negative", message: msg });
  } finally {
    salvando.value = false;
  }
};

watch(model, (val) => {
  if (val) {
    tab.value = "dados";
    buscaPermissao.value = "";
    carregarDados();
  }
});
</script>
