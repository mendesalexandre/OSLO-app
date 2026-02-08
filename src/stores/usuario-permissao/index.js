import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";

export const useUsuarioPermissaoStore = defineStore(
  "usuario-permissao",
  () => {
    const usuarios = ref([]);
    const loading = ref(false);

    const listarUsuarios = async (params = {}) => {
      const { data } = await api.get("/usuario", { params });
      usuarios.value = data.data?.data ?? data.data ?? [];
      return data.data;
    };

    const listarPermissoes = async (usuarioId) => {
      const { data } = await api.get(`/usuario/${usuarioId}/permissao`);
      return data.data;
    };

    const permissoesEfetivas = async (usuarioId) => {
      const { data } = await api.get(
        `/usuario/${usuarioId}/permissao/efetivas`
      );
      return data.data;
    };

    const sincronizarGrupos = async (usuarioId, grupoIds) => {
      const { data } = await api.put(
        `/usuario/${usuarioId}/permissao/grupos`,
        { grupo_ids: grupoIds }
      );
      return data.data;
    };

    const adicionarPermissao = async (usuarioId, payload) => {
      const { data } = await api.post(
        `/usuario/${usuarioId}/permissao`,
        payload
      );
      return data.data;
    };

    const removerPermissao = async (usuarioId, permissaoId) => {
      const { data } = await api.delete(
        `/usuario/${usuarioId}/permissao/${permissaoId}`
      );
      return data.data;
    };

    return {
      usuarios,
      loading,
      listarUsuarios,
      listarPermissoes,
      permissoesEfetivas,
      sincronizarGrupos,
      adicionarPermissao,
      removerPermissao,
    };
  }
);
