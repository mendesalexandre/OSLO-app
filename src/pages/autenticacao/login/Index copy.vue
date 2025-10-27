<template>
  <div class="login-container">
    <!-- Layout de duas colunas -->
    <div class="row no-wrap full-height">
      <!-- Coluna da esquerda - 8/12 -->
      <div class="col-8 login-left-section">
        <div class="left-content">
          <!-- Logo e branding -->
          <div class="brand-section">
            <div class="brand-logo">
              <q-icon name="fa-duotone fa-building-columns" size="48px" class="brand-icon" />
            </div>
            <h1 class="brand-title">SISTEMA OSLO</h1>
            <p class="brand-subtitle">Plataforma completa para gestão cartorária</p>
          </div>

          <!-- Features -->
          <div class="features-section">
            <div class="feature-item">
              <q-icon name="fa-duotone fa-shield-check" size="24px" class="feature-icon" />
              <div class="feature-text">
                <h3>Segurança Avançada</h3>
                <p>Proteção de dados com criptografia de ponta</p>
              </div>
            </div>

            <div class="feature-item">
              <q-icon name="fa-duotone fa-chart-line" size="24px" class="feature-icon" />
              <div class="feature-text">
                <h3>Análises Inteligentes</h3>
                <p>Relatórios detalhados e insights em tempo real</p>
              </div>
            </div>

            <div class="feature-item">
              <q-icon name="fa-duotone fa-users" size="24px" class="feature-icon" />
              <div class="feature-text">
                <h3>Gestão Completa</h3>
                <p>Controle total de usuários e permissões</p>
              </div>
            </div>
          </div>

          <!-- Footer info -->
          <!-- <div class="footer-info">
            <p>© 2025 Sistema Oslo. Todos os direitos reservados.</p>
          </div> -->
        </div>
      </div>

      <!-- Coluna da direita - 4/12 -->
      <div class="col-4 login-right-section">
        <div class="login-form-container">
          <!-- Header do login -->
          <div class="login-header">
            <h2>Bem-vindo de volta</h2>
            <p>Acesse sua conta para continuar</p>
          </div>

          <!-- Formulário de login -->
          <q-form @submit="handleLogin" class="login-form">
            <!-- Campo de email -->
            <div class="form-group">
              <label class="form-label">E-mail</label>
              <q-input v-model="form.email" type="email" outlined placeholder="Digite seu e-mail" class="login-input"
                :rules="[val => !!val || 'E-mail é obrigatório']" dense>
                <template v-slot:prepend>
                  <q-icon name="fa-duotone fa-envelope" class="input-icon" />
                </template>
              </q-input>
            </div>

            <!-- Campo de senha -->
            <div class="form-group">
              <label class="form-label">Senha</label>
              <q-input v-model="form.password" :type="showPassword ? 'text' : 'password'" outlined
                placeholder="Digite sua senha" class="login-input" :rules="[val => !!val || 'Senha é obrigatória']"
                dense>
                <template v-slot:prepend>
                  <q-icon name="fa-duotone fa-lock" class="input-icon" />
                </template>
                <template v-slot:append>
                  <q-btn flat round dense :icon="showPassword ? 'fa-duotone fa-eye-slash' : 'fa-duotone fa-eye'"
                    @click="showPassword = !showPassword" class="password-toggle" />
                </template>
              </q-input>
            </div>

            <!-- Lembrar de mim e esqueci senha -->
            <div class="form-options">
              <q-checkbox v-model="form.remember" label="Lembrar de mim" class="remember-checkbox" />
              <q-btn flat no-caps class="forgot-password-btn" @click="navigateToForgotPassword">
                Esqueci minha senha
              </q-btn>
            </div>

            <!-- Botão de login -->
            <q-btn label="Entrar" type="submit" class="login-btn" :loading="isLoading" unelevated
              icon-right="fa-duotone fa-arrow-right-to-bracket">
            </q-btn>
          </q-form>

          <!-- Divider -->
          <div class="divider">
            <span>ou</span>
          </div>

          <!-- Login social (opcional) -->
          <div class="social-login">
            <!-- <q-btn outline no-caps class="social-btn google-btn" @click="loginWithGoogle">
              <q-icon name="fa-brands fa-google" class="q-mr-sm" />
              Continuar com Google
            </q-btn> -->

            <!-- <q-btn outline no-caps class="social-btn microsoft-btn" @click="loginWithMicrosoft">
              <q-icon name="fa-brands fa-microsoft" class="q-mr-sm" />
              Continuar com Microsoft
            </q-btn> -->
          </div>

          <!-- Link para registro -->
          <div class="register-link">
            <span>Não tem uma conta?</span>
            <q-btn flat no-caps unelevated class="register-btn no-hover-effect" @click="navigateToRegister">
              Criar conta
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'LoginPage'
});

const $q = useQuasar();
const router = useRouter();

// Estado do formulário
const form = ref({
  email: '',
  password: '',
  remember: false
});

const showPassword = ref(false);
const isLoading = ref(false);

// Métodos
const handleLogin = async () => {
  isLoading.value = true;

  try {
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validação simples para demo
    if (form.value.email === 'admin@oslo.com' && form.value.password === '123456') {
      $q.notify({
        type: 'positive',
        message: 'Login realizado com sucesso!',
        position: 'top-right',
        timeout: 2000,
        icon: 'fa-duotone fa-check-circle'
      });

      // Simular salvamento do token
      localStorage.setItem('auth_token', 'demo_token_123');

      // Redirecionar para dashboard
      router.push({ name: 'home' });
    } else {
      $q.notify({
        type: 'negative',
        message: 'E-mail ou senha incorretos',
        position: 'top-right',
        timeout: 3000,
        icon: 'fa-duotone fa-circle-exclamation'
      });
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao fazer login. Tente novamente.',
      position: 'top-right',
      timeout: 3000,
      icon: 'fa-duotone fa-triangle-exclamation'
    });
  } finally {
    isLoading.value = false;
  }
};

const navigateToForgotPassword = () => {
  router.push({ name: 'auth.forgot' });
};

const navigateToRegister = () => {
  router.push({ name: 'auth.register' });
};

const loginWithGoogle = () => {
  $q.notify({
    type: 'info',
    message: 'Login com Google em desenvolvimento',
    position: 'top-right',
    timeout: 2000
  });
};

const loginWithMicrosoft = () => {
  $q.notify({
    type: 'info',
    message: 'Login com Microsoft em desenvolvimento',
    position: 'top-right',
    timeout: 2000
  });
};
</script>

<style scoped>
/* ===== LAYOUT PRINCIPAL ===== */
.login-page {
  min-height: 100vh;
  background: #f9fafb;
}

.full-height {
  min-height: 100%;
}

/* ===== SEÇÃO ESQUERDA ===== */
.login-left-section {
  height: 100%;
  background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* overflow: hidden; */
}

.left-content {
  position: relative;
  z-index: 1;
  max-width: 500px;
  color: white;
  text-align: center;
  height: 100% !important;
}

/* ===== BRANDING ===== */
.brand-section {
  margin-bottom: 3rem;
}

.brand-logo {
  margin-bottom: 1.5rem;
}

.brand-icon {
  --fa-primary-color: #ffffff;
  --fa-secondary-color: #d1d5db;
  --fa-secondary-opacity: 0.7;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.brand-subtitle {
  font-size: 1.125rem;
  color: #d1d5db;
  margin: 0;
  font-weight: 400;
}

/* ===== FEATURES ===== */
.features-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.feature-icon {
  --fa-primary-color: #d1d5db;
  --fa-secondary-color: #9ca3af;
  --fa-secondary-opacity: 0.7;
  flex-shrink: 0;
}

.feature-text h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.feature-text p {
  font-size: 0.875rem;
  color: #d1d5db;
  margin: 0;
}

/* ===== FOOTER INFO ===== */
.footer-info {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* ===== SEÇÃO DIREITA ===== */
.login-right-section {
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
}

.login-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.login-form-container {
  width: 100%;
  /* max-width: 400px; */
  background: white;
  /* padding: 2rem; */
  border-radius: 2px;
  /* box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); */
}

/* ===== HEADER DO LOGIN ===== */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.login-header p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

/* ===== FORMULÁRIO ===== */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.login-input {
  font-size: 0.875rem;
}

.input-icon {
  --fa-primary-color: #6b7280;
  --fa-secondary-color: #9ca3af;
  --fa-secondary-opacity: 0.6;
}

.password-toggle {
  color: #6b7280;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-checkbox {
  font-size: 0.875rem;
}

.forgot-password-btn {
  font-size: 0.875rem;
  color: #3b82f6;
  padding: 0;
}

/* .forgot-password-btn:hover {
  color: #2563eb;
} */

/* ===== BOTÃO DE LOGIN ===== */
.login-btn {
  background: #374151;
  color: white;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 100%;
}

.login-btn:hover {
  background: #111827;
}

/* ===== DIVIDER ===== */
.divider {
  position: relative;
  text-align: center;
  margin: 2rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  color: #6b7280;
  padding: 0 1rem;
  font-size: 0.875rem;
  position: relative;
}

/* ===== LOGIN SOCIAL ===== */
.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-btn {
  width: 100%;
  padding: 12px 24px;
  border-radius: 2px !important;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  color: #374151;
}

/*
.social-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
} */

/* ===== LINK DE REGISTRO ===== */
.register-link {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.register-btn {
  color: #3b82f6;
  font-weight: 500;
  padding: 0 0.25rem;
}

/*
.register-btn:hover {
  color: #2563eb;
} */

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }

  .login-left-section {
    display: none;
  }

  .login-right-section {
    width: 100%;
    padding: 1rem;
  }

  .brand-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    max-width: 100%;
    padding: 0;
  }

  .brand-title {
    font-size: 1.75rem;
  }

  .features-section {
    gap: 1.5rem;
  }
}

.q-field--outlined.q-field--focused .q-field__control {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.q-checkbox .q-checkbox__icon {
  color: #3b82f6;
}
</style>