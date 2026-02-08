<template>
  <!-- Header -->
  <div class="dashboard-header">
    <h1 class="dashboard-title">Gestão Financeira</h1>
  </div>

  <!-- Cards Financeiros -->
  <div class="financial-cards">
    <!-- Despesa -->
    <div class="financial-card card-despesa" @click="navigateTo('despesa')">
      <div class="card-icon">
        <q-icon name="eva-trending-down-outline" size="32px" />
      </div>
      <div class="card-label">DESPESA</div>
    </div>

    <!-- Receita -->
    <div class="financial-card card-receita" @click="navigateTo('receita')">
      <div class="card-icon">
        <q-icon name="eva-trending-up-outline" size="32px" />
      </div>
      <div class="card-label">RECEITA</div>
    </div>

    <!-- Transferências -->
    <div class="financial-card card-transferencia" @click="navigateTo('transferencia')">
      <div class="card-icon">
        <q-icon name="eva-swap-outline" size="32px" />
      </div>
      <div class="card-label">TRANSF.</div>
    </div>

    <!-- Cheques -->
    <div class="financial-card card-cheques" @click="navigateTo('cheques')">
      <div class="card-icon">
        <q-icon name="eva-credit-card-outline" size="32px" />
      </div>
      <div class="card-label">CHEQUES</div>
    </div>

    <!-- Extrato Geral -->
    <div class="financial-card card-extrato" @click="navigateTo('extrato')">
      <div class="card-icon">
        <q-icon name="eva-file-text-outline" size="32px" />
      </div>
      <div class="card-label">EXTRATO GERAL</div>
    </div>

    <!-- Notas Fiscais -->
    <div class="financial-card card-notas" @click="navigateTo('notas-fiscais')">
      <div class="card-icon">
        <q-icon name="eva-archive-outline" size="32px" />
      </div>
      <div class="card-label">NOTAS FISCAIS</div>
    </div>

    <!-- Caixas Inativos -->
    <div class="financial-card card-caixas" @click="navigateTo('caixas-inativos')">
      <div class="card-icon">
        <q-icon name="eva-cube-outline" size="32px" />
      </div>
      <div class="card-label">CAIXAS INATIVOS</div>
    </div>

    <!-- Valores a Receber/Devolver -->
    <div class="financial-card card-valores" @click="navigateTo('valores')">
      <div class="card-icon">
        <q-icon name="eva-refresh-outline" size="32px" />
      </div>
      <div class="card-label">VALORES A RECEBER/DEVOLVER</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const $router = useRouter();

const navigateTo = (module) => {
  console.log(`Navegando para: ${module}`);
  // Implementar navegação específica para cada módulo
  // $router.push({ name: `financeiro.${module}` });
};
</script>

<style lang="scss" scoped>
.dashboard-header {
  padding: 20px 24px;
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border-color);
}

.dashboard-title {
  color: var(--text-color);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.financial-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.financial-card {
  background: #ffffff;
  border-radius: var(--radius-md);
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    transition: height 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);

    .card-icon {
      transform: scale(1.1);
    }
  }
}

.card-icon {
  color: #ffffff;
  transition: transform 0.3s ease;
}

.card-label {
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.card-despesa {
  background: var(--negative);
  &::before { background: var(--negative); }
}

.card-receita {
  background: var(--positive);
  &::before { background: var(--positive); }
}

.card-transferencia {
  background: var(--info);
  &::before { background: var(--info); }
}

.card-cheques {
  background: var(--warning);
  &::before { background: var(--warning); }
}

.card-extrato {
  background: #e67e22;
  &::before { background: #e67e22; }
}

.card-notas {
  background: #8e44ad;
  &::before { background: #8e44ad; }
}

.card-caixas {
  background: var(--secondary);
  &::before { background: var(--secondary); }
}

.card-valores {
  background: var(--accent);
  &::before { background: var(--accent); }
}

@media (max-width: 768px) {
  .financial-cards {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    padding: 16px;
  }

  .financial-card {
    padding: 16px 12px;
    min-height: 100px;
    gap: 8px;
  }

  .card-label {
    font-size: 0.7rem;
  }

  .dashboard-header {
    padding: 16px 20px;
  }
}

@media (max-width: 480px) {
  .financial-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 12px;
  }

  .financial-card {
    padding: 12px 8px;
    min-height: 90px;
    gap: 6px;
  }

  .card-label {
    font-size: 0.65rem;
  }
}
</style>