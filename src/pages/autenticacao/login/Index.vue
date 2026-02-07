<template>
  <div class="login-page">
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
          <div class="footer-info">
            <p>© 2025 Sistema Oslo. Todos os direitos reservados.</p>
          </div>
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
          <q-form class="login-form">
            <!-- Campo de usuário (email ou telefone) -->
            <div class="form-group">
              <label class="form-label">E-mail ou Telefone</label>
              <q-input v-model="form.email" type="text" outlined placeholder="Digite seu e-mail ou telefone"
                class="login-input" :rules="[val => !!val || 'Campo obrigatório']" ref="emailRef" dense autofocus
                hide-bottom-space>
                <template v-slot:prepend>
                  <q-icon name="fa-duotone fa-user" class="input-icon" />
                </template>
              </q-input>
            </div>

            <!-- Campo de senha -->
            <div class="form-group">
              <label class="form-label">Senha</label>
              <q-input v-model="form.senha" :type="isPwd ? 'password' : 'text'" outlined placeholder="Digite sua senha"
                class="login-input" :rules="[val => !!val || 'Senha é obrigatória']" ref="senhaRef" dense
                hide-bottom-space @keyup.enter="onSubmit">
                <template v-slot:prepend>
                  <q-icon name="fa-duotone fa-lock" class="input-icon" />
                </template>
                <template v-slot:append>
                  <q-btn flat round dense :icon="isPwd ? 'fa-duotone fa-eye' : 'fa-duotone fa-eye-slash'"
                    @click="isPwd = !isPwd" class="password-toggle" />
                </template>
              </q-input>
            </div>

            <!-- Lembrar de mim e esqueci senha -->
            <!-- <div class="form-options">
              <q-checkbox v-model="form.lembrarMe" label="Lembrar de mim" class="remember-checkbox" />
              <q-btn flat no-caps class="forgot-password-btn" @click="onEsqueciSenha">
                Esqueci minha senha
              </q-btn>
            </div> -->

            <!-- Botão de login -->
            <q-btn label="Entrar" class="login-btn" :loading="loading" unelevated :disable="!form.email || !form.senha"
              icon-right="fa-duotone fa-arrow-right-to-bracket" @click="onSubmit">
              <template v-slot:loading>
                <q-spinner class="on-left" />
                Entrando...
              </template>
            </q-btn>
          </q-form>

          <!-- Divider -->
          <!-- <div class="divider">
            <span>ou</span>
          </div> -->

          <!-- Login social (opcional) -->
          <!-- <div class="social-login">
            <q-btn outline no-caps class="social-btn google-btn" @click="loginWithGoogle">
              <q-icon name="fa-brands fa-google" class="q-mr-sm" />
              Continuar com Google
            </q-btn>

            <q-btn outline no-caps class="social-btn microsoft-btn" @click="loginWithMicrosoft">
              <q-icon name="fa-brands fa-microsoft" class="q-mr-sm" />
              Continuar com Microsoft
            </q-btn>
          </div> -->

          <!-- Link para registro -->
          <!-- <div class="register-link">
            <span>Não tem uma conta?</span>
            <q-btn flat no-caps unelevated class="register-btn" @click="navigateToRegister">
              Criar conta
            </q-btn>
          </div> -->
        </div>
      </div>
    </div>
  </div>

  <!-- Toast de erro moderno -->
  <q-dialog v-model="showError" position="top">
    <q-card class="error-toast">
      <q-card-section class="row items-center no-wrap">
        <q-icon name="fa-duotone fa-triangle-exclamation" class="error-icon" />
        <div class="error-message">{{ errorMessage }}</div>
        <q-space />
        <q-btn flat round dense icon="fa-duotone fa-xmark" @click="showError = false" class="close-button" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/auth";

defineOptions({
  name: "LoginPage",
});

const $q = useQuasar();
const router = useRouter();
const $api = api;
const authStore = useAuthStore();

// Estado reativo
const loading = ref(false);
const isPwd = ref(true);
const showError = ref(false);
const errorMessage = ref("");

// Referências dos campos
const emailRef = ref(null);
const senhaRef = ref(null);

// Formulárioform.email
const form = reactive({
  email: "",
  senha: "",
  lembrarMe: false,
});

// Função de submit
const onSubmit = async () => {
  if (!form.email || !form.senha) {
    $q.notify({
      color: "negative",
      message: "Preencha todos os campos",
      icon: "fa-duotone fa-triangle-exclamation",
      position: "top"
    });
    return;
  }

  loading.value = true;

  try {
    const response = await $api.post("/auth/login", {
      email: form.email,
      password: form.senha,
    });

    // JWT response: { success: true, data: { access_token, token_type, expires_in, user } }
    const token = response.data.data?.access_token || response.data.access_token;
    authStore.setToken(token);

    $q.notify({
      color: "positive",
      message: "Login realizado com sucesso!",
      icon: "fa-duotone fa-circle-check",
      position: "top"
    });

    router.push({ name: "tarefas" });

  } catch (error) {
    const mensagem = error.response?.data?.message || error.response?.data?.error || "Erro ao fazer login";

    $q.notify({
      color: "negative",
      message: mensagem,
      icon: "fa-duotone fa-circle-xmark",
      position: "top"
    });
  } finally {
    loading.value = false;
  }
};
// Função esqueci senha
const onEsqueciSenha = () => {
  $q.notify({
    color: "info",
    message: "Entre em contato com o administrador",
    icon: "fa-duotone fa-circle-info",
    position: "top",
    classes: 'modern-notification'
  });
};

// Verificar se há usuário salvo
const checkRememberedUser = () => {
  const rememberedUser = localStorage.getItem("doi_remember_user");
  if (rememberedUser) {
    form.email = rememberedUser;
    form.lembrarMe = true;
  }
};

// Executar ao montar o componente
checkRememberedUser();
</script>

<style lang="scss" scoped>
/* ===== LAYOUT PRINCIPAL ===== */
.login-page {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #f9fafb;
}

.full-height {
  height: 100vh;
  overflow: hidden;
}

/* ===== SEÇÃO ESQUERDA ===== */
.login-left-section {
  height: 100vh;
  background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.left-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  padding: 3rem;
  color: white;
  text-align: center;
}

/* ===== BRANDING ===== */
.brand-section {
  margin-bottom: 4rem;
}

.brand-logo {
  margin-bottom: 1.5rem;
}

.brand-icon {
  --fa-primary-color: #ffffff;
  --fa-secondary-color: #d1d5db;
  --fa-secondary-opacity: 0.7;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  letter-spacing: 3px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.brand-subtitle {
  font-size: 1.125rem;
  color: #e5e7eb;
  margin: 0;
  font-weight: 400;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* ===== FEATURES ===== */
.features-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  text-align: left;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(8px);
  }
}

.feature-icon {
  --fa-primary-color: #ffffff;
  --fa-secondary-color: #d1d5db;
  --fa-secondary-opacity: 0.7;
  flex-shrink: 0;
  margin-top: 2px;
}

.feature-text h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.feature-text p {
  font-size: 0.875rem;
  color: #e5e7eb;
  margin: 0;
  line-height: 1.5;
}

/* ===== FOOTER INFO ===== */
.footer-info {
  font-size: 0.75rem;
  color: #d1d5db;
  margin-top: 3rem;
}

/* ===== SEÇÃO DIREITA ===== */
.login-right-section {
  height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}

.login-form-container {
  width: 100%;
  max-width: 420px;
}

/* ===== HEADER DO LOGIN ===== */
.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
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
  gap: 1.25rem;
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

:deep(.login-input) {
  .q-field__control {
    border-radius: 8px;
    border-color: #e5e7eb;
    background: #ffffff;
    transition: all 0.2s ease;

    &:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
  }

  &.q-field--focused .q-field__control {
    border-color: #374151;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.1);
  }

  .q-field__native {
    font-size: 0.875rem;
    padding: 12px 16px;
  }
}

.input-icon {
  --fa-primary-color: #6b7280;
  --fa-secondary-color: #9ca3af;
  --fa-secondary-opacity: 0.6;
  font-size: 18px;
}

.password-toggle {
  color: #6b7280;

  &:hover {
    color: #374151;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
}

:deep(.remember-checkbox) {
  font-size: 0.875rem;

  .q-checkbox__label {
    color: #374151;
  }

  .q-checkbox__inner {
    color: #374151;
  }
}

.forgot-password-btn {
  font-size: 0.875rem;
  color: #374151;
  padding: 0;
  font-weight: 500;

  &:hover {
    color: #111827;
    text-decoration: underline;
  }
}

/* ===== BOTÃO DE LOGIN ===== */
.login-btn {
  background: linear-gradient(135deg, #6b7280, #374151);
  color: white;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 100%;
  box-shadow: 0 4px 14px 0 rgba(55, 65, 81, 0.25);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #4b5563, #1f2937);
    box-shadow: 0 6px 20px 0 rgba(55, 65, 81, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    box-shadow: none;
  }
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
  border-radius: 8px;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  color: #374151;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
}

/* ===== LINK DE REGISTRO ===== */
.register-link {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 1.5rem;
}

.register-btn {
  color: #374151;
  font-weight: 500;
  padding: 0 0.25rem;

  &:hover {
    color: #111827;
    text-decoration: underline;
  }
}

/* ===== TOAST DE ERRO ===== */
.error-toast {
  background: linear-gradient(135deg, #DC2626, #B91C1C);
  color: white;
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 25px -3px rgba(220, 38, 38, 0.3);
  backdrop-filter: blur(10px);
  min-width: 300px;
}

.error-icon {
  --fa-primary-color: #ffffff;
  --fa-secondary-color: rgba(255, 255, 255, 0.8);
  --fa-secondary-opacity: 1;
  font-size: 24px;
  margin-right: 12px;
}

.error-message {
  font-weight: 500;
  font-size: 14px;
}

.close-button {
  color: rgba(255, 255, 255, 0.8);

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
}

/* ===== NOTIFICAÇÕES MODERNAS ===== */
:deep(.modern-notification) {
  border-radius: 12px;
  backdrop-filter: blur(10px);
  font-weight: 500;
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 1024px) {
  .login-left-section {
    display: none;
  }

  .login-right-section {
    width: 100% !important;
  }
}

@media (max-width: 768px) {
  .login-right-section {
    padding: 1.5rem;
  }

  .login-form-container {
    max-width: 100%;
  }

  .login-header h2 {
    font-size: 1.25rem;
  }

  .login-header {
    margin-bottom: 1.25rem;
  }

  .login-form {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .login-right-section {
    padding: 1rem;
  }

  .login-header {
    margin-bottom: 1rem;
  }

  .login-header h2 {
    font-size: 1.125rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .login-form {
    gap: 0.875rem;
  }
}

/* ===== FIX SCROLL ===== */
body,
html {
  overflow: hidden;
  height: 100vh;
  margin: 0;
  padding: 0;
}

/* ===== ANIMAÇÕES ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form-container {
  animation: fadeInUp 0.6s ease;
}
</style>