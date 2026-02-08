<template>

</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useProtocoloStore } from "src/stores/protocolo";
import { data, dataHora } from "src/Utils/DataHora";
// import Oficio from "src/pages/oficio/Index.vue";
import { formatarCpfCnpj } from "src/Utils";

defineOptions({
  name: "ProtocoloGeralIndex",
});

const protocoloStore = useProtocoloStore();
const { protocolo } = storeToRefs(protocoloStore);

const modalNovoOficio = ref(false);
const mostrandoNovaAnotacao = ref(false);
const novaAnotacao = ref("");

// Função para definir cor do status
const getStatusColor = (status) => {
  const statusColors = {
    VIGENTE: "green-9",
    Pendente: "orange-6",
    Finalizado: "blue-6",
    Cancelado: "red-6",
  };
  return statusColors[status] || "grey-6";
};

const toggleNovaAnotacao = () => {
  mostrandoNovaAnotacao.value = !mostrandoNovaAnotacao.value;
  if (!mostrandoNovaAnotacao.value) {
    novaAnotacao.value = "";
  }
};

const cancelarAnotacao = () => {
  mostrandoNovaAnotacao.value = false;
  novaAnotacao.value = "";
};

async function publicarAnotacao() {
  if (!novaAnotacao.value?.trim()) return;

  await protocoloAnotacaoStore.create({
    protocolo_id: protocolo.value.id,
    anotacao: novaAnotacao.value,
  });

  await protocoloStore.show(protocolo.value.uuid);
  novaAnotacao.value = "";
  mostrandoNovaAnotacao.value = false;
}

async function avancarEtapa(id, dto) {
  try {
    await protocoloStore.avancarEtapa(id, dto);
  } catch (e) {
    console.log(e);
  }
}

const mostrarModalNovoOficio = () => {
  modalNovoOficio.value = !modalNovoOficio.value;
};

const editarAnotacao = (anotacao) => {
  // Implementar edição
  console.log("Editar anotação:", anotacao);
};

const confirmarExclusao = (anotacao) => {
  // Implementar confirmação de exclusão
  console.log("Excluir anotação:", anotacao);
};
</script>

<style lang="scss" scoped>
.ds-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border-color);

  .ds-header-title {
    font-weight: 600;
    color: var(--text-color);
  }
}

.ds-anotacoes-melhoradas {
  .ds-nova-anotacao {
    background: var(--bg-subtle);
    padding: 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
  }

  .ds-annotations {
    max-height: 400px;

    .ds-annotations-container {
      max-height: 320px;
      overflow-y: auto;
    }
  }

  .ds-annotation-item {
    padding: 4px;
    border-bottom: 1px solid var(--border-color);
    transition: all var(--transition);

    &:hover {
      .anotacao-actions {
        opacity: 1;
      }
    }

    &:last-child {
      border-bottom: none;
    }

    .anotacao-actions {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .anotacao-conteudo {
      margin-left: 32px;
      margin-top: 8px;
      line-height: 1.5;
    }
  }
}

.rotate-45 {
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}

.ds-table-branca {
  .ds-table-label {
    width: 30%;
    font-weight: 500;
    color: var(--text-secondary);
    padding: 8px 16px;
    background: #ffffff !important;
  }

  .ds-table-value {
    padding: 4px 16px;
    color: var(--text-color);
    background: #ffffff !important;
  }

  tbody tr:hover {
    background: transparent !important;
  }

  tbody tr {
    background: #ffffff !important;
  }
}

.ds-table {
  .ds-table-label {
    width: 30%;
    font-weight: 500;
    color: var(--text-secondary);
    padding: 8px 16px;
    background: var(--bg-subtle);
  }

  .ds-table-value {
    padding: 8px 16px;
    color: var(--text-color);
  }

  tbody tr:hover {
    background: transparent !important;
  }
}
</style>