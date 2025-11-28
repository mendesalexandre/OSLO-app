<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Novo Registro</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-card bordered>
          <q-card-section>
            <q-form @submit="onSubmit">
              <!-- Nome e Registro Ativo -->
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-md-8">
                  <v-label label="Nome"></v-label>
                  <q-input v-model="form.nome" outlined dense :rules="[val => !!val || 'Campo obrigatório']" />
                </div>
                <div class="col-xs-12 col-md-4">
                  <div class="q-gutter-sm">
                    <v-label label="Registro Ativo"></v-label>
                    <q-option-group v-model="form.registro_ativo" :options="simNaoOptions" color="primary" inline
                      dense />
                  </div>
                </div>
              </div>

              <!-- Gerenciar Modelo e Layout -->
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-md-3">
                  <div class="q-gutter-sm">
                    <v-label label="Gerenciar Modelo em Word?"></v-label>
                    <q-option-group v-model="form.gerenciar_modelo_word" :options="simNaoOptions" color="primary" inline
                      dense />
                  </div>
                </div>
                <div class="col-xs-12 col-md-3">
                  <v-label label="Layout de Impressão"></v-label>
                  <q-select v-model="form.layout_impressao" :options="layoutOptions" outlined dense emit-value
                    map-options />
                </div>
                <div class="col-xs-12 col-md-3">
                  <div class="q-gutter-sm">
                    <v-label label="Permitir Edição da Minuta?"></v-label>
                    <q-option-group v-model="form.permitir_edicao_minuta" :options="simNaoOptions" color="primary"
                      inline dense />
                  </div>
                </div>
                <div class="col-xs-12 col-md-3">
                  <q-btn label="Gerenciar Minuta" color="primary" outline dense @click="gerenciarMinuta" />
                </div>
              </div>

              <!-- Permitir ato digital e Enviar certidão -->
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-md-6">
                  <div class="q-gutter-sm">
                    <div class="text-subtitle2">Permitir ser ato digital?</div>
                    <q-option-group v-model="form.permitir_ato_digital" :options="simNaoOptions" color="primary" inline
                      dense />
                  </div>
                </div>
                <div class="col-xs-12 col-md-6">
                  <div class="q-gutter-sm">
                    <div class="text-subtitle2">Enviar certidão de ato praticado de notificação?</div>
                    <q-option-group v-model="form.enviar_certidao_notificacao" :options="simNaoOptions" color="primary"
                      inline dense />
                  </div>
                </div>
              </div>

              <q-separator class="q-my-md" />

              <!-- Checklist -->
              <div>
                <div class="text-subtitle2 q-mb-sm">Checklist</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12 col-md-10">
                    <q-select v-model="checklistSelecionado" :options="checklistOptions" outlined dense use-input
                      @filter="filterChecklist" placeholder="Selecione um checklist" />
                  </div>
                  <div class="col-xs-12 col-md-2">
                    <q-btn label="Adicionar" color="primary" outline dense class="full-width"
                      @click="adicionarChecklist" />
                  </div>
                </div>

                <!-- Lista de checklists adicionados -->
                <q-list bordered separator class="q-mt-sm" v-if="form.checklists.length">
                  <q-item v-for="(checklist, index) in form.checklists" :key="index">
                    <q-item-section>{{ checklist.nome }}</q-item-section>
                    <q-item-section side>
                      <q-btn icon="delete" flat dense round color="negative" size="sm"
                        @click="removerChecklist(index)" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <q-separator class="q-my-md" />

              <!-- Papéis Ativos -->
              <div>
                <div class="text-subtitle2 q-mb-sm">Papéis Ativos</div>
                <div class="q-gutter-xs">
                  <q-chip v-for="papel in papeisAtivos" :key="papel.value"
                    :selected.sync="form.papeis_ativos[papel.value]" clickable color="primary" text-color="white"
                    :outline="!form.papeis_ativos[papel.value]">
                    {{ papel.label }}
                  </q-chip>
                </div>
              </div>

              <q-separator />

              <!-- Botões -->
              <div class="row q-gutter-sm justify-end">
                <q-btn label="Cancelar" outline color="primary" @click="onCancel" />
                <q-btn label="Salvar" type="submit" color="primary" :loading="loading" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const loading = ref(false)
const checklistSelecionado = ref(null)
const checklistOptions = ref([])
const checklistOptionsOriginal = ref([
  // Carregar do backend
  { label: 'Checklist 1', value: 1 },
  { label: 'Checklist 2', value: 2 },
])

const form = reactive({
  nome: 'Extrajudicial',
  registro_ativo: true,
  gerenciar_modelo_word: false,
  layout_impressao: 'oficio',
  permitir_edicao_minuta: false,
  permitir_ato_digital: true,
  enviar_certidao_notificacao: false,
  checklists: [],
  papeis_ativos: {
    adquirente: false,
    anuente: false,
    credor: false,
    destinatario: false,
    devedor: false,
    interessado: false,
    notificado: false,
    notificante: false,
    remetente: false,
    transmitente: false,
  }
})

const simNaoOptions = [
  { label: 'Sim', value: true },
  { label: 'Não', value: false }
]

const layoutOptions = [
  { label: 'Ofício', value: 'oficio' },
  { label: 'A4', value: 'a4' },
  { label: 'Personalizado', value: 'personalizado' }
]

const papeisAtivos = [
  { label: 'Adquirente', value: 'adquirente' },
  { label: 'Anuente', value: 'anuente' },
  { label: 'Credor', value: 'credor' },
  { label: 'Destinatário', value: 'destinatario' },
  { label: 'Devedor', value: 'devedor' },
  { label: 'Interessado', value: 'interessado' },
  { label: 'Notificado', value: 'notificado' },
  { label: 'Notificante', value: 'notificante' },
  { label: 'Remetente', value: 'remetente' },
  { label: 'Transmitente', value: 'transmitente' },
]

const filterChecklist = (val, update) => {
  update(() => {
    if (val === '') {
      checklistOptions.value = checklistOptionsOriginal.value
    } else {
      const needle = val.toLowerCase()
      checklistOptions.value = checklistOptionsOriginal.value.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

const adicionarChecklist = () => {
  if (checklistSelecionado.value) {
    const exists = form.checklists.find(c => c.value === checklistSelecionado.value.value)
    if (!exists) {
      form.checklists.push({ ...checklistSelecionado.value })
      checklistSelecionado.value = null
    } else {
      $q.notify({
        type: 'warning',
        message: 'Checklist já adicionado'
      })
    }
  }
}

const removerChecklist = (index) => {
  form.checklists.splice(index, 1)
}

const gerenciarMinuta = () => {
  // Implementar lógica de gerenciar minuta
  $q.notify({
    type: 'info',
    message: 'Funcionalidade de gerenciar minuta'
  })
}

const onSubmit = async () => {
  loading.value = true

  try {
    // Preparar dados para envio
    const papeisSelecionados = Object.entries(form.papeis_ativos)
      .filter(([_, selected]) => selected)
      .map(([papel]) => papel)

    const payload = {
      ...form,
      papeis_ativos: papeisSelecionados,
      checklist_ids: form.checklists.map(c => c.value)
    }

    // Fazer requisição para API
    // await api.post('/naturezas', payload)

    $q.notify({
      type: 'positive',
      message: 'Natureza criada com sucesso!'
    })

    router.push('/naturezas')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao criar natureza: ' + error.message
    })
  } finally {
    loading.value = false
  }
}

const onCancel = () => {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente cancelar? As alterações não salvas serão perdidas.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    router.push('/naturezas')
  })
}
</script>