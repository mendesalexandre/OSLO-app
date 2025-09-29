<template>
  <q-page class="pagina-administracao q-pa-md">
    <!-- Gestão de Usuários -->
    <div class="secao-admin q-mb-lg">
      <h6 class="titulo-secao q-mb-sm">Gestão de Usuários</h6>
      <q-separator class="q-mb-md" />
      <div class="grade-cards">
        <q-card bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/departamentos')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-users" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Departamentos
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/usuarios')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-user" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Usuários
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/grupos-permissao')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-user-shield" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Grupos de Permissão
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Editor -->
    <div class="secao-admin q-mb-lg">
      <h6 class="titulo-secao q-mb-sm">Editor</h6>
      <q-separator class="q-mb-md" />
      <div class="grade-cards">
        <q-card flat bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/listas')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-list" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Listas
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/checklists')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-check-square" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Checklists
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/fragmentos')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-puzzle-piece" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Fragmentos
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/layouts-impressao')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-print" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Layouts de Impressão
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/modelos-textuais')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-font" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Modelos Textuais
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Geral -->
    <div class="secao-admin q-mb-lg">
      <h6 class="titulo-secao q-mb-sm">Geral</h6>
      <q-separator class="q-mb-md" />
      <div class="grade-cards">
        <q-card flat bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/tipos-documento')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-file-alt" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Tipos de Documento
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/repasses')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-briefcase" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Repasses
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="card-menu cursor-pointer" @click="navegarPara('/admin/feriados')">
          <q-card-section class="secao-card">
            <div class="conteudo-centralizado">
              <q-icon name="fas fa-calendar-day" size="24px" class="icone-card q-mb-sm" color="grey-7" />
              <div class="titulo-card text-grey-8">
                Feriados
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navegarPara = (rota) => {
  router.push(rota)
}
</script>

<style scoped>
.pagina-administracao {
  max-width: 1200px;
  margin: 0 auto;
}

.secao-admin {
  border-radius: 2px !important;
  padding: 24px;
  box-shadow: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a !important;
  color: #e0e0e0 !important;
}

.titulo-secao {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.grade-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.card-menu {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-menu:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.secao-card {
  padding: 24px 16px;
  width: 100%;
}

.conteudo-centralizado {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.icone-card {
  transition: color 0.3s ease;
}

.titulo-card {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
}

@media (max-width: 600px) {
  .grade-cards {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>