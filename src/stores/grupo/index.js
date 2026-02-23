import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";

export const useGrupoStore = defineStore("grupo", () => {
  const grupos = ref([]);
  const grupo = ref({});
  const loading = ref(false);

  const index = async (params = {}) => {
    const { data } = await api.get("/grupo", { params });
    grupos.value = data.dados?.data ?? data.dados ?? [];
    return grupos.value;
  };

  const show = async (id) => {
    const { data } = await api.get(`/grupo/${id}`);
    grupo.value = data.dados;
    return grupo.value;
  };

  const create = async (payload) => {
    const { data } = await api.post("/grupo", payload);
    return data.dados;
  };

  const update = async (id, payload) => {
    const { data } = await api.put(`/grupo/${id}`, payload);
    return data.dados;
  };

  const destroy = async (id) => {
    await api.delete(`/grupo/${id}`);
  };

  const sincronizarPermissoes = async (id, permissaoIds) => {
    const { data } = await api.put(`/grupo/${id}/permissoes`, {
      permissao_ids: permissaoIds,
    });
    return data.dados;
  };

  return {
    grupos,
    grupo,
    loading,
    index,
    show,
    create,
    update,
    destroy,
    sincronizarPermissoes,
  };
});
