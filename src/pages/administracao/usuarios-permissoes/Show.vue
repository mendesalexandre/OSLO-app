<template>
  <modal v-model="model" :titulo="`Permissões de ${usuario?.nome || ''}`" tamanho="lg">
    <q-tabs v-model="tab" no-caps class="q-mb-md" active-color="primary" indicator-color="primary" dense align="left">
      <q-tab name="grupos" label="Grupos" />
      <q-tab name="individuais" label="Permissões Individuais" />
      <q-tab name="resumo" label="Resumo" />
    </q-tabs>

    <div v-if="carregando" class="text-center q-py-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <q-tab-panels v-else v-model="tab" animated>
      <!-- Tab Grupos -->
      <q-tab-panel name="grupos" class="q-pa-none">
        <q-card flat bordered>
          <q-card-section>
            <p class="oslo-text-secondary q-mb-md">Selecione os grupos que este usuário pertence.</p>
            <div class="row q-col-gutter-sm">
              <div v-for="g in gruposDisponiveis" :key="g.id" class="col-md-6 col-12">
                <q-card flat bordered class="q-pa-sm" :class="{ 'grupo-selecionado': gruposSelecionados.includes(g.id) }">
                  <q-checkbox
                    v-model="gruposSelecionados"
                    :val="g.id"
                    color="primary"
                  >
                    <template #default>
                      <div>
                        <div class="text-weight-medium">{{ g.nome }}</div>
                        <div class="text-caption oslo-text-secondary">{{ g.descricao }}</div>
                      </div>
                    </template>
                  </q-checkbox>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Tab Permissões Individuais -->
      <q-tab-panel name="individuais" class="q-pa-none">
        <q-card flat bordered>
          <q-card-section>
            <p class="oslo-text-secondary q-mb-md">
              Defina permissões individuais que sobrescrevem as permissões do grupo.
            </p>

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
                dense
              >
                <template #header>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ modulo.nome }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge
                      :color="overridesPorModulo(modulo.nome) > 0 ? 'warning' : 'grey-4'"
                      :text-color="overridesPorModulo(modulo.nome) > 0 ? 'white' : 'grey-7'"
                      :label="overridesPorModulo(modulo.nome)"
                    />
                  </q-item-section>
                </template>

                <q-card flat>
                  <q-card-section class="q-pt-none">
                    <div v-for="perm in modulo.permissoes" :key="perm.id" class="row items-center q-py-xs perm-row">
                      <div class="col">
                        <div class="text-body2">{{ perm.descricao || perm.nome }}</div>
                        <code class="text-caption oslo-text-secondary">{{ perm.nome }}</code>
                      </div>
                      <div class="col-auto">
                        <q-btn-toggle
                          v-model="permissoesIndividuais[perm.id]"
                          :options="[
                            { label: 'Herdar', value: null },
                            { label: 'Permitir', value: 'permitir' },
                            { label: 'Negar', value: 'negar' },
                          ]"
                          no-caps
                          dense
                          unelevated
                          size="sm"
                          :toggle-color="toggleColor(permissoesIndividuais[perm.id])"
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

      <!-- Tab Resumo -->
      <q-tab-panel name="resumo" class="q-pa-none">
        <q-card flat bordered>
          <q-card-section v-if="!resumo">
            <div class="text-center q-py-md">
              <q-btn label="Carregar resumo" flat color="primary" @click="carregarResumo" :loading="carregandoResumo" />
            </div>
          </q-card-section>

          <q-card-section v-else>
            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-auto">
                <q-badge :color="resumo.is_admin ? 'positive' : 'grey-5'" :label="resumo.is_admin ? 'Administrador' : 'Usuário comum'" />
              </div>
              <div v-for="g in resumo.grupos" :key="g" class="col-auto">
                <q-badge color="primary" outline :label="g" />
              </div>
            </div>

            <q-list>
              <template v-for="(perms, modulo) in resumo.modulos" :key="modulo">
                <q-item-label header class="text-weight-medium q-pb-none">{{ modulo }}</q-item-label>
                <q-item v-for="perm in perms" :key="perm" dense>
                  <q-item-section avatar style="min-width: 24px">
                    <q-icon name="check_circle" color="positive" size="16px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption">{{ perm }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
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
import { ref, computed, watch, reactive } from "vue";
import { useQuasar } from "quasar";
import { useUsuarioPermissaoStore } from "src/stores/usuario-permissao";
import { useGrupoStore } from "src/stores/grupo";
import { usePermissaoStore } from "src/stores/permissao";

const props = defineProps({
  usuario: { type: Object, default: null },
});

const emit = defineEmits(["salvo"]);
const model = defineModel({ default: false });

const $q = useQuasar();
const usuarioPermissaoStore = useUsuarioPermissaoStore();
const grupoStore = useGrupoStore();
const permissaoStore = usePermissaoStore();

const tab = ref("grupos");
const carregando = ref(false);
const salvando = ref(false);
const carregandoResumo = ref(false);
const buscaPermissao = ref("");

const gruposDisponiveis = ref([]);
const gruposSelecionados = ref([]);
const todasPermissoes = ref([]);
const permissoesIndividuais = reactive({});
const resumo = ref(null);

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

const overridesPorModulo = (modulo) => {
  const mod = modulosAgrupados.value.find((m) => m.nome === modulo);
  if (!mod) return 0;
  return mod.permissoes.filter((p) => permissoesIndividuais[p.id] != null).length;
};

const toggleColor = (val) => {
  if (val === "permitir") return "positive";
  if (val === "negar") return "negative";
  return "grey-5";
};

const carregarDados = async () => {
  if (!props.usuario?.id) return;

  carregando.value = true;
  resumo.value = null;

  try {
    const [grupos, perms, dadosUsuario] = await Promise.all([
      grupoStore.index({ sem_paginacao: true }),
      permissaoStore.listarTodas(),
      usuarioPermissaoStore.listarPermissoes(props.usuario.id),
    ]);

    gruposDisponiveis.value = grupos;
    todasPermissoes.value = perms;

    gruposSelecionados.value = (dadosUsuario.grupos || []).map((g) => g.id);

    // Reset individual permissions
    Object.keys(permissoesIndividuais).forEach((k) => delete permissoesIndividuais[k]);
    (dadosUsuario.permissoes_individuais || []).forEach((p) => {
      permissoesIndividuais[p.id] = p.tipo;
    });
  } catch {
    $q.notify({ type: "negative", message: "Erro ao carregar dados." });
  } finally {
    carregando.value = false;
  }
};

const carregarResumo = async () => {
  if (!props.usuario?.id) return;
  carregandoResumo.value = true;
  try {
    resumo.value = await usuarioPermissaoStore.permissoesEfetivas(props.usuario.id);
  } catch {
    $q.notify({ type: "negative", message: "Erro ao carregar resumo." });
  } finally {
    carregandoResumo.value = false;
  }
};

const salvar = async () => {
  if (!props.usuario?.id) return;
  salvando.value = true;

  try {
    // 1. Sync groups
    await usuarioPermissaoStore.sincronizarGrupos(props.usuario.id, gruposSelecionados.value);

    // 2. Sync individual permissions: remove old, add new
    const dadosAtuais = await usuarioPermissaoStore.listarPermissoes(props.usuario.id);
    const permissoesAtuais = dadosAtuais.permissoes_individuais || [];

    // Remove all current individual permissions
    for (const p of permissoesAtuais) {
      await usuarioPermissaoStore.removerPermissao(props.usuario.id, p.id);
    }

    // Add new individual permissions
    for (const [permId, tipo] of Object.entries(permissoesIndividuais)) {
      if (tipo) {
        await usuarioPermissaoStore.adicionarPermissao(props.usuario.id, {
          permissao_id: parseInt(permId),
          tipo,
        });
      }
    }

    $q.notify({ type: "positive", message: "Permissões salvas com sucesso." });
    model.value = false;
    emit("salvo");
  } catch (error) {
    const msg = error?.response?.data?.message || "Erro ao salvar permissões.";
    $q.notify({ type: "negative", message: msg });
  } finally {
    salvando.value = false;
  }
};

watch(model, (val) => {
  if (val) {
    tab.value = "grupos";
    buscaPermissao.value = "";
    carregarDados();
  }
});
</script>

<style lang="scss" scoped>
.grupo-selecionado {
  border-color: var(--primary) !important;
  background: rgba(var(--primary-rgb), 0.04);
}

.perm-row {
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }
}
</style>
