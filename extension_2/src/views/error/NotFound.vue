<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">{{ t('pageNotFound') }}</h2>
      <p class="error-message">
        {{ t('pageNotFoundMessage') }}
      </p>
      <router-link to="/" class="error-link">
        {{ t('backHome') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
  color: var(--color-primary);
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

.error-link {
  display: inline-block;
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s;
}

.error-link:hover {
  background: var(--color-primary-dark, #0056b3);
}
</style>