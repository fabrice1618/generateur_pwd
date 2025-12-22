<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">403</h1>
      <h2 class="error-title">{{ t('accessDenied') }}</h2>
      <p class="error-message">
        {{ t('accessDeniedMessage') }}
      </p>
      <div class="error-actions">
        <router-link to="/" class="error-link">
          {{ t('backHome') }}
        </router-link>
        <button @click="login" class="error-link secondary">
          {{ t('login') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

function login() {
  // TODO: redirect to login page or open modal
  router.push({ name: 'login' })
}
</script>

<style scoped>
.error-page {
  text-align: center;
}

.error-content {
  max-width: 500px;
  margin: 0 auto;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: var(--color-accent);
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: 2rem;
  margin: 1rem 0;
  color: var(--text);
}

.error-message {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.error-link {
  display: inline-block;
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s;
  border: none;
  cursor: pointer;
}

.error-link:hover {
  background: var(--color-primary-dark, #0056b3);
}

.error-link.secondary {
  background: var(--surface);
  color: var(--text);
}

.error-link.secondary:hover {
  background: var(--color-muted);
}
</style>