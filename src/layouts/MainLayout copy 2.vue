<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER MODERNIZADO -->
    <q-header bordered elevated class="header-custom">
      <q-toolbar class="toolbar-custom">
        <!-- Botão Menu -->
        <q-btn flat dense round aria-label="Menu" @click="toggleLeftDrawer" class="menu-toggle-btn"
          :class="{ 'menu-toggle-btn--active': leftDrawerOpen }">
          <q-icon name="fa-duotone fa-bars" size="16px" class="menu-toggle-icon" />
        </q-btn>

        <q-space />

        <!-- Breadcrumb dinâmico -->
        <div class="breadcrumb-section">
          <q-breadcrumbs class="text-grey-7" separator-color="grey-4">
            <q-breadcrumbs-el v-for="(crumb, index) in breadcrumbs" :key="index" :label="crumb.label" :to="crumb.to"
              :class="{ 'text-primary': index === breadcrumbs.length - 1 }" />
          </q-breadcrumbs>
        </div>

        <q-space />

        <!-- Ações do header -->
        <div class="header-actions">
          <!-- Busca global -->
          <q-btn flat round dense class="header-action-btn" @click="toggleSearch">
            <q-icon name="fa-duotone fa-magnifying-glass" size="16px" />
            <q-tooltip class="bg-dark text-white">Buscar (Ctrl+K)</q-tooltip>
          </q-btn>

          <!-- Notificações -->
          <q-btn flat round dense class="header-action-btn notification-btn" @click="toggleNotifications">
            <q-icon name="fa-duotone fa-bell" size="16px" />
            <q-badge v-if="totalNotifications > 0" color="red" floating rounded
              :label="totalNotifications > 99 ? '99+' : totalNotifications" class="notification-badge-header" />
            <q-tooltip class="bg-dark text-white">
              Notificações {{ totalNotifications > 0 ? `(${totalNotifications})` : '' }}
            </q-tooltip>
          </q-btn>

          <!-- Modo escuro/claro -->
          <q-btn flat round dense class="header-action-btn theme-toggle" @click="toggleTheme">
            <q-icon :name="isDarkMode ? 'fa-duotone fa-sun' : 'fa-duotone fa-moon'" size="16px" class="theme-icon" />
            <q-tooltip class="bg-dark text-white">
              {{ isDarkMode ? 'Modo Claro' : 'Modo Escuro' }}
            </q-tooltip>
          </q-btn>

          <!-- Menu do usuário no header -->
          <q-btn flat round dense class="header-user-btn">
            <div class="header-user-avatar">
              <span v-if="!user?.avatar" class="header-user-initial">
                {{ getUserInitial() }}
              </span>
              <img v-else :src="user.avatar" alt="Avatar" class="header-avatar-img" />
            </div>
            <q-menu anchor="bottom right" self="top right" class="user-menu-header">
              <q-list style="min-width: 220px" class="user-menu-list">
                <q-item-label header class="user-menu-header-content">
                  <div class="header-user-info">
                    <div class="user-avatar-large">
                      <span v-if="!user?.avatar" class="user-initial-large">
                        {{ getUserInitial() }}
                      </span>
                      <img v-else :src="user.avatar" alt="Avatar" class="avatar-img-large" />
                    </div>
                    <div class="user-details">
                      <div class="user-name">{{ user?.nome || "Usuário" }}</div>
                      <div class="user-email">{{ user?.email || "user@example.com" }}</div>
                      <div class="user-role">{{ user?.role || "Administrador" }}</div>
                    </div>
                  </div>
                </q-item-label>
                <q-separator />
                <q-item clickable v-close-popup @click="verPerfil" class="user-menu-item">
                  <q-item-section avatar>
                    <q-icon name="fa-duotone fa-user" size="16px" color="grey-6" />
                  </q-item-section>
                  <q-item-section>Meu Perfil</q-item-section>
                  <q-item-section side>
                    <q-icon name="fa-solid fa-chevron-right" size="12px" color="grey-4" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="editarPerfil" class="user-menu-item">
                  <q-item-section avatar>
                    <q-icon name="fa-duotone fa-user-pen" size="16px" color="grey-6" />
                  </q-item-section>
                  <q-item-section>Editar Perfil</q-item-section>
                  <q-item-section side>
                    <q-icon name="fa-solid fa-chevron-right" size="12px" color="grey-4" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="alterarSenha" class="user-menu-item">
                  <q-item-section avatar>
                    <q-icon name="fa-duotone fa-lock" size="16px" color="grey-6" />
                  </q-item-section>
                  <q-item-section>Alterar Senha</q-item-section>
                  <q-item-section side>
                    <q-icon name="fa-solid fa-chevron-right" size="12px" color="grey-4" />
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="logout" class="user-menu-item logout-item">
                  <q-item-section avatar>
                    <q-icon name="fa-duotone fa-arrow-right-from-bracket" size="16px" color="red-6" />
                  </q-item-section>
                  <q-item-section>Sair do Sistema</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-tooltip class="bg-dark text-white">{{ user?.nome || "Usuário" }}</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- DRAWER LATERAL -->
    <q-drawer bordered v-model="leftDrawerOpen" show-if-above side="left" :width="60" :breakpoint="500"
      class="drawer-custom">
      <q-list class="text-center text-caption w-full">

        <!-- Menu Principal -->
        <div class="menu-section">
          <q-item clickable v-ripple exact class="menu-item"
            :class="{ 'menu-item--active': $route.path === '/navigation' }">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-compass" size="16px" class="menu-icon" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Navegação
            </q-tooltip>
          </q-item>

          <q-item clickable v-ripple exact class="menu-item"
            :class="{ 'menu-item--active': $route.path === '/dashboard' }">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-grid-2" size="18px" class="menu-icon" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Dashboard
            </q-tooltip>
          </q-item>
        </div>

        <q-separator class="menu-separator" />

        <!-- MENU PRINCIPAL -->
        <div class="menu-section">
          <q-item clickable v-ripple to="/" class="menu-item" :class="{ 'menu-item--active': $route.path === '/' }">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-house" size="16px" class="menu-icon" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Início
            </q-tooltip>
          </q-item>

          <q-item clickable v-ripple to="/usuarios" class="menu-item"
            :class="{ 'menu-item--active': $route.path.startsWith('/usuarios') }">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-users" size="16px" class="menu-icon" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Usuários
            </q-tooltip>
          </q-item>

          <q-item clickable v-ripple to="/arquivos" class="menu-item"
            :class="{ 'menu-item--active': $route.path.startsWith('/arquivos') }">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-folder" size="16px" class="menu-icon" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Arquivos
            </q-tooltip>
          </q-item>

          <q-item clickable v-ripple to="/calendario" class="menu-item"
            :class="{ 'menu-item--active': $route.path.startsWith('/calendario') }">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-calendar-days" size="16px" class="menu-icon" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Calendário
            </q-tooltip>
          </q-item>

          <q-item clickable v-ripple to="/mensagens" class="menu-item"
            :class="{ 'menu-item--active': $route.path.startsWith('/mensagens') }">
            <q-item-section>
              <q-item-label class="relative-position">
                <q-icon name="fa-duotone fa-envelope" size="16px" class="menu-icon" />
                <q-badge v-if="unreadMessages > 0" color="red" floating rounded
                  :label="unreadMessages > 99 ? '99+' : unreadMessages" class="notification-badge" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Mensagens {{ unreadMessages > 0 ? `(${unreadMessages})` : '' }}
            </q-tooltip>
          </q-item>

          <q-item clickable v-ripple to="/vendas" class="menu-item"
            :class="{ 'menu-item--active': $route.path.startsWith('/vendas') }">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-cart-shopping" size="16px" class="menu-icon" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Vendas
            </q-tooltip>
          </q-item>

          <q-item clickable v-ripple to="/relatorios" class="menu-item"
            :class="{ 'menu-item--active': $route.path.startsWith('/relatorios') }">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-chart-pie" size="16px" class="menu-icon" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Relatórios
            </q-tooltip>
          </q-item>
        </div>
      </q-list>

      <!-- Spacer para empurrar menu do usuário para o final -->
      <div class="col q-pt-lg"></div>

      <!-- Menu do usuário no rodapé -->
      <div class="absolute-bottom">
        <q-separator class="menu-separator" />
        <q-list class="text-center text-caption text-slate-900">
          <!-- Botão de perfil do usuário -->
          <q-item clickable v-ripple class="menu-item user-menu-item">
            <q-item-section>
              <q-item-label class="relative-position">
                <!-- Avatar ou inicial do usuário -->
                <div class="user-avatar">
                  <span v-if="!user?.avatar" class="user-initial">
                    {{ getUserInitial() }}
                  </span>
                  <img v-else :src="user.avatar" alt="Avatar" class="avatar-img" />
                </div>
                <q-menu anchor="top middle" self="bottom middle" class="user-menu">
                  <q-list style="min-width: 200px" class="user-menu-list">
                    <q-item-label header class="text-grey-8 user-menu-header">
                      <div class="user-avatar-large">
                        <span v-if="!user?.avatar" class="user-initial-large">
                          {{ getUserInitial() }}
                        </span>
                        <img v-else :src="user.avatar" alt="Avatar" class="avatar-img-large" />
                      </div>
                      <div class="user-info">
                        <div class="user-name">{{ user?.nome || "Usuário" }}</div>
                        <div class="user-email">{{ user?.email || "user@example.com" }}</div>
                      </div>
                    </q-item-label>
                    <q-separator />
                    <q-item clickable v-close-popup @click="verPerfil" class="user-menu-item">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-gear" size="16px" color="grey-6" />
                      </q-item-section>
                      <q-item-section>Configurações</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="editarPerfil" class="user-menu-item">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-user-pen" size="16px" color="grey-6" />
                      </q-item-section>
                      <q-item-section>Editar Perfil</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="alterarSenha" class="user-menu-item">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-lock" size="16px" color="grey-6" />
                      </q-item-section>
                      <q-item-section>Alterar Senha</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="logout" class="user-menu-item logout-item">
                      <q-item-section avatar>
                        <q-icon name="fa-duotone fa-arrow-right-from-bracket" size="16px" color="red-6" />
                      </q-item-section>
                      <q-item-section>Sair</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              {{ user?.nome || "Usuário" }}
            </q-tooltip>
          </q-item>

          <!-- Botão de configurações gerais -->
          <q-item clickable v-ripple class="menu-item">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-gear" size="16px" class="menu-icon" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Configurações Gerais
            </q-tooltip>
          </q-item>

          <q-item clickable v-ripple @click="logout" class="menu-item logout-main">
            <q-item-section>
              <q-item-label>
                <q-icon name="fa-duotone fa-arrow-right-from-bracket" size="16px" class="menu-icon logout-icon" />
              </q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-dark text-white">
              Sair do Sistema
            </q-tooltip>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <!-- BUSCA GLOBAL (OVERLAY) -->
    <q-dialog v-model="showSearch" class="search-overlay">
      <q-card class="search-card">
        <q-card-section class="search-section">
          <div class="search-input-container">
            <q-icon name="fa-duotone fa-magnifying-glass" class="search-icon" />
            <q-input v-model="searchQuery" placeholder="Digite para buscar..." autofocus borderless class="search-input"
              @keyup.enter="performSearch" @keyup.esc="showSearch = false" />
            <q-btn flat round dense icon="fa-solid fa-xmark" @click="showSearch = false" class="search-close" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="search-results">
          <div v-if="!searchQuery" class="search-suggestions">
            <div class="suggestion-title">Sugestões</div>
            <q-item clickable class="suggestion-item">
              <q-item-section avatar>
                <q-icon name="fa-duotone fa-users" size="16px" />
              </q-item-section>
              <q-item-section>Buscar usuários</q-item-section>
            </q-item>
            <q-item clickable class="suggestion-item">
              <q-item-section avatar>
                <q-icon name="fa-duotone fa-folder" size="16px" />
              </q-item-section>
              <q-item-section>Buscar arquivos</q-item-section>
            </q-item>
          </div>
          <div v-else class="search-loading">
            <q-spinner color="primary" size="20px" />
            <span class="q-ml-sm">Buscando...</span>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- CONTEÚDO PRINCIPAL -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";

defineOptions({
  name: "MainLayout",
});

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

// ===== ESTADO DA APLICAÇÃO =====
const leftDrawerOpen = ref(false);
const showSearch = ref(false);
const searchQuery = ref('');
const isDarkMode = ref(false);

// Dados do usuário (substitua pela sua store/api)
const user = ref({
  nome: "João Silva",
  email: "joao.silva@example.com",
  role: "Administrador",
  avatar: null // URL da imagem do avatar
});

// Notificações
const unreadMessages = ref(3);
const totalNotifications = ref(7);

// ===== COMPUTED PROPERTIES =====

// Breadcrumbs dinâmicos baseados na rota atual
const breadcrumbs = computed(() => {
  const path = route.path;
  const segments = path.split('/').filter(Boolean);

  const crumbs = [{ label: 'Início', to: '/' }];

  // Mapeamento de rotas para labels mais amigáveis
  const routeLabels = {
    'usuarios': 'Usuários',
    'arquivos': 'Arquivos',
    'calendario': 'Calendário',
    'mensagens': 'Mensagens',
    'vendas': 'Vendas',
    'relatorios': 'Relatórios',
    'dashboard': 'Dashboard',
    'configuracoes': 'Configurações',
    'perfil': 'Perfil'
  };

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    crumbs.push({
      label,
      to: index === segments.length - 1 ? undefined : currentPath
    });
  });

  return crumbs;
});

// ===== MÉTODOS UTILITÁRIOS =====

// Obter inicial do nome do usuário
const getUserInitial = () => {
  const nome = user.value?.nome || "U";
  return nome.charAt(0).toUpperCase();
};

// ===== MÉTODOS DE NAVEGAÇÃO =====

// Toggle do menu lateral
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

// Abrir/fechar busca global
const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) {
    searchQuery.value = '';
  }
};

// ===== MÉTODOS DE AÇÃO =====

// Executar busca
const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Buscando:', searchQuery.value);
    $q.notify({
      message: `Buscando: "${searchQuery.value}"`,
      type: 'info',
      position: 'top-right',
      timeout: 2000
    });
    showSearch.value = false;
    searchQuery.value = '';
  }
};

// Toggle de notificações
const toggleNotifications = () => {
  $q.notify({
    message: 'Painel de notificações em desenvolvimento',
    type: 'info',
    position: 'top-right',
    timeout: 2000
  });
};

// Toggle de tema escuro/claro
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  $q.dark.set(isDarkMode.value);

  $q.notify({
    message: `Modo ${isDarkMode.value ? 'escuro' : 'claro'} ativado`,
    type: 'positive',
    position: 'top-right',
    timeout: 1500,
    icon: isDarkMode.value ? 'fa-duotone fa-moon' : 'fa-duotone fa-sun'
  });
};

// ===== MÉTODOS DO USUÁRIO =====

// Logout com confirmação
const logout = () => {
  $q.dialog({
    title: 'Confirmar Saída',
    message: 'Tem certeza de que deseja sair do sistema?',
    cancel: {
      label: 'Cancelar',
      color: 'grey',
      flat: true
    },
    ok: {
      label: 'Sair',
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    $q.notify({
      message: 'Logout realizado com sucesso!',
      type: 'positive',
      position: 'top-right',
      timeout: 2000,
      icon: 'fa-duotone fa-check-circle'
    });

    // Aqui você implementaria a lógica real de logout
    // Exemplo: limpar tokens, redirect para login, etc.
    console.log('Logout confirmado - implementar lógica de logout');
  });
};

// Navegar para perfil
const verPerfil = () => {
  router.push('/perfil');
  $q.notify({
    message: 'Navegando para o perfil...',
    type: 'info',
    position: 'top-right',
    timeout: 1500
  });
};

// Navegar para editar perfil
const editarPerfil = () => {
  router.push('/perfil/editar');
  $q.notify({
    message: 'Abrindo editor de perfil...',
    type: 'info',
    position: 'top-right',
    timeout: 1500
  });
};

// Navegar para alterar senha
const alterarSenha = () => {
  router.push('/perfil/senha');
  $q.notify({
    message: 'Abrindo alteração de senha...',
    type: 'info',
    position: 'top-right',
    timeout: 1500
  });
};

// ===== ATALHOS DE TECLADO =====

const handleKeyboardShortcuts = (event) => {
  // Ctrl+K ou Cmd+K para busca global
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    toggleSearch();
  }

  // Esc para fechar busca
  if (event.key === 'Escape' && showSearch.value) {
    showSearch.value = false;
    searchQuery.value = '';
  }

  // Ctrl+B para toggle do menu lateral
  if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
    event.preventDefault();
    toggleLeftDrawer();
  }
};

// ===== LIFECYCLE HOOKS =====

onMounted(() => {
  document.addEventListener('keydown', handleKeyboardShortcuts);

  // Notificação de boas-vindas
  setTimeout(() => {
    $q.notify({
      message: `Bem-vindo, ${user.value.nome}!`,
      type: 'positive',
      position: 'top-right',
      timeout: 3000,
      icon: 'fa-duotone fa-hand-wave'
    });
  }, 1000);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts);
});
</script>

<style scoped>
/* ===== CUSTOMIZAÇÃO DO HEADER ===== */
.header-custom {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.toolbar-custom {
  padding: 0 20px;
  min-height: 64px;
}

.menu-toggle-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px !important;
  padding: 8px;
}

.menu-toggle-btn:hover {
  background-color: rgba(102, 126, 234, 0.08);
  transform: scale(1.05);
}

.menu-toggle-btn--active .menu-toggle-icon {
  transform: rotate(90deg);
}

.menu-toggle-icon {
  transition: transform 0.3s ease;
  --fa-primary-color: #667eea;
  --fa-secondary-color: #a5b3f7;
  --fa-secondary-opacity: 0.6;
}

/* Breadcrumb */
.breadcrumb-section {
  display: flex;
  align-items: center;
  font-weight: 500;
}

/* ===== AÇÕES DO HEADER ===== */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-action-btn {
  border-radius: 2px !important;
  transition: all 0.3s ease;
  position: relative;
}

.header-action-btn:hover {
  background-color: #f3f4f6;
}

.notification-btn {
  position: relative;
}

.notification-badge-header {
  font-size: 10px;
  min-width: 10px;
  height: 16px;
  top: -4px !important;
  right: -4px !important;
}

.theme-toggle .theme-icon {
  transition: all 0.3s ease;
  --fa-primary-color: #6b7280;
  --fa-secondary-color: #fbbf24;
  --fa-secondary-opacity: 0.7;
}

.theme-toggle:hover .theme-icon {
  transform: rotate(15deg);
}

/* ===== AVATAR DO USUÁRIO NO HEADER ===== */
.header-user-btn {
  border-radius: 2px !important;
  /* padding: 4px; */
  transition: all 0.3s ease;
}

.header-user-btn:hover {
  background-color: #f3f4f6;
}

.header-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-user-initial {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.header-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* ===== MENU DO USUÁRIO NO HEADER ===== */
.user-menu-header {
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.user-menu-header-content {
  /* padding: 16px !important; */
  background: #f9fafb;
}

.header-user-info {
  display: flex !important;
  align-items: center !important;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
}

.user-email {
  font-size: 12px;
  color: #6b7280;
}

.user-role {
  font-size: 11px;
  color: #374151;
  font-weight: 500;
  background: #e5e7eb;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

/* ===== CUSTOMIZAÇÃO DO DRAWER ===== */
.drawer-custom {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
}

/* Seções do menu */
.menu-section {
  /* padding: 8px 0; */
}

.menu-separator {
  /* margin: 8px 12px; */
  background-color: #e5e7eb;
}

/* ===== ITENS DO MENU ===== */
.menu-item {
  margin: 2px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
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
  background: #3b82f6;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.menu-item:hover {
  background-color: #f3f4f6;
}

.menu-item--active {
  background-color: #dbeafe;
}

.menu-item--active::before {
  transform: scaleY(1);
}

/* ===== ÍCONES DO MENU ===== */
.menu-icon {
  transition: all 0.3s ease;
  --fa-primary-color: #6b7280;
  --fa-secondary-color: #9ca3af;
  --fa-secondary-opacity: 0.6;
}

.menu-item:hover .menu-icon {
  --fa-primary-color: #374151;
  --fa-secondary-color: #6b7280;
}

.menu-item--active .menu-icon {
  --fa-primary-color: #3b82f6;
  --fa-secondary-color: #60a5fa;
}

/* ===== BADGES DE NOTIFICAÇÃO ===== */
.notification-badge {
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  top: -8px !important;
  right: -8px !important;
}

/* ===== AVATAR DO USUÁRIO NO DRAWER ===== */
.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
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
  background: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* ===== MENU DO USUÁRIO NO DRAWER ===== */
.user-menu {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.user-menu-header {
  display: flex !important;
  align-items: center !important;
  gap: 12px;
  padding: 16px !important;
  background: #f9fafb;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-menu-item {
  transition: all 0.2s ease;
}

.user-menu-item:hover {
  background-color: #f9fafb;
}

.logout-item:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

/* ===== ÍCONE DE LOGOUT ===== */
.logout-icon {
  --fa-primary-color: #dc2626;
  --fa-secondary-color: #f87171;
  --fa-secondary-opacity: 0.5;
}

.logout-main:hover .logout-icon {
  --fa-primary-color: #b91c1c;
}

/* ===== BUSCA GLOBAL ===== */
.search-overlay .q-dialog__inner {
  padding-top: 10vh;
}

.search-card {
  width: 90%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.search-section {
  padding: 20px;
}

.search-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-icon {
  color: #6b7280;
  --fa-primary-color: #6b7280;
  --fa-secondary-color: #9ca3af;
  --fa-secondary-opacity: 0.6;
}

.search-input {
  flex: 1;
  font-size: 16px;
}

.search-input .q-field__control {
  border: none !important;
  box-shadow: none !important;
}

.search-close {
  color: #6b7280;
  transition: all 0.2s ease;
}

.search-close:hover {
  color: #374151;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
  padding: 16px;
}

.search-suggestions .suggestion-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.suggestion-item {
  border-radius: 6px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background-color: #f9fafb;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #6b7280;
}

/* ===== RESPONSIVIDADE ===== */
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

  .breadcrumb-section {
    display: none;
  }
}
</style>