import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";

export const usePermissaoStore = defineStore("permissao", () => {
  const permissoes = ref([]);
  const modulos = ref([]);
  const loading = ref(false);

  const index = async (params = {}) => {
    const { data } = await api.get("/permissao", { params });
    permissoes.value = data.dados?.data ?? data.dados ?? [];
    return permissoes.value;
  };

  const listarModulos = async () => {
    const { data } = await api.get("/permissao/modulos");
    modulos.value = data.dados;
    return modulos.value;
  };

  const listarPorModulo = async (modulo) => {
    const { data } = await api.get(`/permissao/modulo/${modulo}`);
    return data.dados;
  };

  const listarTodas = async () => {
    const { data } = await api.get("/permissao", {
      params: { sem_paginacao: true },
    });
    return data.dados ?? [];
  };

  return {
    permissoes,
    modulos,
    loading,
    index,
    listarModulos,
    listarPorModulo,
    listarTodas,
  };
});
