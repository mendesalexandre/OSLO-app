<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered elevated class="bg-white">
      <q-toolbar>
        <q-btn flat round aria-label="Menu" @click="toggleLeftDrawer" color="dark" icon="menu">
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer bordered v-model="leftDrawerOpen" show-if-above side="left" :width="60" :breakpoint="500" elevated>
      <q-list class="text-center text-caption w-full">

        <!-- Menu Principal -->
        <q-item clickable v-ripple exact class="menu-item-hover">
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-location-arrow" size="14px" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <!-- Ícone de MAIS com shadow -->
        <q-item clickable v-ripple exact @click="abrirModalCriarProtocolo" class="menu-item-hover">
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-solid fa-square-plus" size="14px" class="icon-with-shadow" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple exact class="menu-item-hover" @click="mostrarModalMenuDeNavegacao">
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-regular fa-bars" size="14px" color="grey-6" />
            </q-item-label>
          </q-item-section>
        </q-item>


        <!-- MENU -->
        <q-item clickable v-ripple class="menu-item-hover">
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-regular fa-magnifying-glass" size="14px" color="grey-6" />

            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple class="menu-item-hover">
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-users" size="14px" color="grey-6" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple class="menu-item-hover">
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-folder" size="14px" color="grey-6" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple class="menu-item-hover">
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-calendar-days" size="14px" color="grey-6" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple class="menu-item-hover">
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-envelope" size="14px" color="grey-6" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple class="menu-item-hover">
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-cart-shopping" size="14px" color="grey-6" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple class="menu-item-hover">
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-chart-pie" size="14px" color="grey-6" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Spacer para empurrar menu do usuário para o final -->
      <div class="col q-pt-lg"></div>

      <!-- Menu do usuário no rodapé -->
      <div class="absolute-bottom">
        <q-list class="text-center text-caption text-slate-900">
          <!-- Botão de perfil do usuário -->
          <q-item clickable v-ripple class="menu-item-hover">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-user" size="14px" color="grey-6" />
                <q-menu anchor="top middle" self="bottom middle">
                  <q-list style="min-width: 180px">
                    <q-item-label header class="text-grey-8">
                      <q-icon name="fa-duotone fa-user" size="14px" class="q-mr-sm" color="grey-6" />
                      {{ user?.nome || "Usuário" }}
                    </q-item-label>
                    <q-separator />
                    <q-item clickable v-close-popup @click="verPerfil">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-gear" size="14px" color="grey-6" />
                      </q-item-section>
                      <q-item-section>Configurações</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="editarPerfil">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-user-pen" size="14px" color="grey-6" />
                      </q-item-section>
                      <q-item-section>Editar Perfil</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="alterarSenha">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-lock" size="14px" color="grey-6" />
                      </q-item-section>
                      <q-item-section>Alterar Senha</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="logout">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-arrow-right-from-bracket" size="14px" color="red-6" />
                      </q-item-section>
                      <q-item-section>Sair</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Botão de configurações gerais -->
          <q-item clickable v-ripple class="menu-item-hover">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-gear" size="14px" color="grey-6" />
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="logout" class="menu-item-hover">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-arrow-right-from-bracket" size="14px" color="grey-6" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <criar-protocolo v-model="modalCriarProtocolo" />
  <criar-indicador-pessoal v-model="modalCriarIndicador" />
  <menu-navegacao v-model="mostrarMenuNavegacao" />
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import CriarProtocolo from "src/components/CriarProtocolo.vue";
import MenuNavegacao from "src/components/Menu.vue";
import CriarIndicadorPessoal from "src/pages/indicador-pessoal/Create.vue";
import { useEstadoStore } from "src/stores/estado";

defineOptions({
  name: "MainLayout",
});

const $q = useQuasar();
const router = useRouter();

// Adicione suas variáveis reativas aqui
const leftDrawerOpen = ref(false);
const modalCriarProtocolo = ref(false);
const modalCriarIndicador = ref(false);


// Adicione seus métodos aqui
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const mostrarMenuNavegacao = ref(false);
function mostrarModalMenuDeNavegacao() {
  mostrarMenuNavegacao.value = !mostrarMenuNavegacao.value;
}

const estadoStore = useEstadoStore();

const abrirModalCriarProtocolo = async () => {
  try {
    await estadoStore.index()
    modalCriarProtocolo.value = true;
  } catch (error) {
    console.error('Erro ao carregar estados:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar estados. Tente novamente mais tarde.'
    });
  }
};


</script>

<style scoped>
/* Shadow no ícone de MAIS */
.icon-with-shadow {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Efeito hover laranja nos itens do menu */
.menu-item-hover:hover .q-icon {
  color: #f2711c !important;
  /* Quasar orange */
  transition: color 0.3s ease;
}

/* Alternativa usando a paleta do Quasar (orange-6) */
.menu-item-hover:hover .q-icon {
  color: var(--q-orange-6) !important;
  transition: color 0.3s ease;
}

.menu-separator {
  margin: 8px 12px;
  background-color: rgba(0, 0, 0, 0.08);
}


/* Responsividade para telas pequenas */
@media (max-width: 500px) {
  .menu-item {
    margin: 1px 4px;
  }

  .menu-separator {
    margin: 6px 8px;
  }

  .user-avatar {
    width: 20px;
    height: 20px;
  }

  .user-initial {
    font-size: 10px;
  }
}
</style>