<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header bordered elevated class="bg-white">
      <q-toolbar>
        <q-btn flat dense round aria-label="Menu" @click="toggleLeftDrawer" color="dark" icon="fa-solid fa-bars"
          size="sm">
        </q-btn>
      </q-toolbar>
    </q-header> -->

    <q-drawer bordered v-model="leftDrawerOpen" show-if-above side="left" :width="60" :breakpoint="500">
      <q-list class="text-center text-caption w-full">

        <!-- Menu Principal -->
        <q-item clickable v-ripple exact>
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-location-arrow" size="18px" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple exact>
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-regular fa-bars" size="18px" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple exact>
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-solid fa-square-plus" size="16px" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <!-- MENU -->
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-magnifying-glass" size="16px" />

            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-users" size="16px" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-folder" size="16px" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-calendar-days" size="16px" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-envelope" size="16px" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-cart-shopping" size="16px" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>
              <q-icon name="fa-duotone fa-chart-pie" size="16px" />
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
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-user" size="16px" />
                <q-menu anchor="top middle" self="bottom middle">
                  <q-list style="min-width: 180px">
                    <q-item-label header class="text-grey-8">
                      <q-icon name="fa-duotone fa-user" size="16px" class="q-mr-sm" />
                      {{ user?.nome || "Usuário" }}
                    </q-item-label>
                    <q-separator />
                    <q-item clickable v-close-popup @click="verPerfil">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-gear" size="16px" color="grey-6" />
                      </q-item-section>
                      <q-item-section>Configurações</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="editarPerfil">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-user-pen" size="16px" color="grey-6" />
                      </q-item-section>
                      <q-item-section>Editar Perfil</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="alterarSenha">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-lock" size="16px" color="grey-6" />
                      </q-item-section>
                      <q-item-section>Alterar Senha</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="logout">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-arrow-right-from-bracket" size="16px" color="red-6" />
                      </q-item-section>
                      <q-item-section>Sair</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Botão de configurações gerais -->
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-gear" size="16px" />
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="logout">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-arrow-right-from-bracket" size="16px" />
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
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import CriarProtocolo from "src/components/CriarProtocolo.vue";

defineOptions({
  name: "MainLayout",
});

const $q = useQuasar();
const router = useRouter();

// Adicione suas variáveis reativas aqui
const leftDrawerOpen = ref(false);
const modalCriarProtocolo = ref(false);

// Adicione seus métodos aqui
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const logout = () => {
  // Implementar logout
  console.log('Logout');
};

const verPerfil = () => {
  // Implementar ver perfil
  console.log('Ver perfil');
};

const editarPerfil = () => {
  // Implementar editar perfil
  console.log('Editar perfil');
};

const alterarSenha = () => {
  // Implementar alterar senha
  console.log('Alterar senha');
};
</script>

<style scoped>
/* Customização do Drawer */
/* Customização do Drawer */
.drawer-custom {
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

/* Seções do menu */
.menu-section {
  padding: 8px 0;
}

.menu-separator {
  margin: 8px 12px;
  background-color: rgba(0, 0, 0, 0.08);
}

/* Itens do menu */
.menu-item {
  margin: 2px 8px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(102, 126, 234, 0.08);
  transform: translateX(2px);
}

.menu-item--active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.menu-item--active::before {
  transform: scaleY(1);
}

/* Ícones do menu */
.menu-icon {
  transition: all 0.3s ease;
  --fa-primary-color: #667eea;
  --fa-secondary-color: #a5b3f7;
  --fa-secondary-opacity: 0.6;
}

.menu-item:hover .menu-icon {
  transform: scale(1.1);
  --fa-primary-color: #5a6fd8;
  --fa-secondary-color: #8b9df6;
}

.menu-item--active .menu-icon {
  --fa-primary-color: #4c63d2;
  --fa-secondary-color: #7986f4;
}

/* Badge de notificações */
.notification-badge {
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  top: -8px !important;
  right: -8px !important;
}

/* Avatar do usuário */
.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-initial {
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* Avatar grande no menu */
.user-avatar-large {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.user-initial-large {
  color: white;
  font-size: 16px;
  font-weight: 700;
}

.avatar-img-large {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* Menu do usuário */
.user-menu {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.user-menu-header {
  display: flex !important;
  align-items: center !important;
  gap: 12px;
  padding: 16px !important;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #1a202c;
}

.user-email {
  font-size: 12px;
  color: #64748b;
}

.user-menu-item {
  transition: all 0.2s ease;
}

.user-menu-item:hover {
  background-color: #f8fafc;
}

.logout-item:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

/* Ícones do menu */
.menu-icon {
  transition: all 0.3s ease;
  --fa-primary-color: #667eea;
  --fa-secondary-color: #a5b3f7;
  --fa-secondary-opacity: 0.6;
}

.menu-item:hover .menu-icon {
  transform: scale(1.1);
  --fa-primary-color: #5a6fd8;
  --fa-secondary-color: #8b9df6;
}

.menu-item--active .menu-icon {
  --fa-primary-color: #4c63d2;
  --fa-secondary-color: #7986f4;
}

/* Badge de notificações */
.notification-badge {
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  top: -8px !important;
  right: -8px !important;
}

/* Ícone de logout com cor especial */
.logout-icon {
  --fa-primary-color: #dc2626;
  --fa-secondary-color: #f87171;
  --fa-secondary-opacity: 0.5;
}

.logout-main:hover .logout-icon {
  transform: scale(1.1);
  --fa-primary-color: #b91c1c;
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