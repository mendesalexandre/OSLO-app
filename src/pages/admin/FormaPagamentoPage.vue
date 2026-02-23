<template>
  <q-page padding>
    <!-- Header -->
    <div class="oslo-page-header">
      <div class="row items-center justify-between">
        <div>
          <h1 class="oslo-page-title">Formas de Pagamento</h1>
          <p class="oslo-page-subtitle">Gerencie as formas de pagamento aceitas</p>
        </div>
        <q-btn
          color="primary"
          icon="add"
          label="Nova Forma"
          unelevated
          no-caps
          @click="abrirModal()"
        />
      </div>
    </div>

    <!-- Tabela -->
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <q-table
          :rows="formaPagamentoStore.formas"
          :columns="columns"
          row-key="id"
          :loading="formaPagamentoStore.carregando"
          flat
          hide-bottom
        >
          <template v-slot:body-cell-ativo="props">
            <q-td :props="props">
              <q-chip
                :color="props.value ? 'green' : 'grey'"
                text-color="white"
                size="sm"
              >
                {{ props.value ? 'Ativo' : 'Inativo' }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-acoes="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="eva-edit-2-outline"
                color="primary"
                size="sm"
                @click="abrirModal(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="eva-trash-2-outline"
                color="negative"
                size="sm"
                @click="confirmarExclusao(props.row)"
              >
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal -->
    <q-dialog v-model="modal" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ formEdicao.id ? 'Editar' : 'Nova' }} Forma de Pagamento</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-md">
            <div>
              <v-label label="Nome" obrigatorio />
              <q-input
                v-model="formEdicao.nome"
                outlined
                dense
                placeholder="Ex: Dinheiro, Crédito, PIX"
              />
            </div>

            <div>
              <v-label label="Descrição" />
              <q-input
                v-model="formEdicao.descricao"
                type="textarea"
                outlined
                rows="3"
                placeholder="Descrição da forma de pagamento"
              />
            </div>

            <div>
              <q-checkbox v-model="formEdicao.ativo" label="Ativa" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
          <q-btn
            label="Salvar"
            color="primary"
            unelevated
            :loading="salvando"
            @click="salvar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useFormaPagamentoStore } from 'src/stores/formaPagamento'

defineOptions({ name: 'FormaPagamentoPage' })

const $q = useQuasar()
const formaPagamentoStore = useFormaPagamentoStore()

const modal = ref(false)
const salvando = ref(false)

const formEdicao = reactive({
  id: null,
  nome: '',
  descricao: '',
  ativo: true,
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

onMounted(() => {
  formaPagamentoStore.listar()
})

function abrirModal(forma = null) {
  if (forma) {
    formEdicao.id = forma.id
    formEdicao.nome = forma.nome
    formEdicao.descricao = forma.descricao || ''
    formEdicao.ativo = forma.ativo
  } else {
    formEdicao.id = null
    formEdicao.nome = ''
    formEdicao.descricao = ''
    formEdicao.ativo = true
  }
  modal.value = true
}

async function salvar() {
  if (!formEdicao.nome) {
    $q.notify({
      type: 'negative',
      message: 'O nome é obrigatório',
      position: 'top',
    })
    return
  }

  salvando.value = true
  try {
    const dados = {
      nome: formEdicao.nome,
      descricao: formEdicao.descricao,
      ativo: formEdicao.ativo,
    }

    if (formEdicao.id) {
      await formaPagamentoStore.atualizar(formEdicao.id, dados)
      $q.notify({
        type: 'positive',
        message: 'Forma de pagamento atualizada com sucesso',
        position: 'top',
      })
    } else {
      await formaPagamentoStore.criar(dados)
      $q.notify({
        type: 'positive',
        message: 'Forma de pagamento criada com sucesso',
        position: 'top',
      })
    }

    modal.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.mensagem || 'Erro ao salvar forma de pagamento',
      position: 'top',
    })
  } finally {
    salvando.value = false
  }
}

function confirmarExclusao(forma) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja excluir a forma de pagamento "${forma.nome}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await formaPagamentoStore.excluir(forma.id)
      $q.notify({
        type: 'positive',
        message: 'Forma de pagamento excluída com sucesso',
        position: 'top',
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.mensagem || 'Erro ao excluir forma de pagamento',
        position: 'top',
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.oslo-page-header {
  margin-bottom: 24px;
}

.oslo-page-title {
  font-size: 24px;
  font-weight: 700;
  color: #202124;
  margin: 0;
  line-height: 1.3;
}

.oslo-page-subtitle {
  font-size: 14px;
  color: #5F6368;
  margin: 4px 0 0 0;
}
</style>
