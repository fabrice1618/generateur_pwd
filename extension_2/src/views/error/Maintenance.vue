<template>
  <div class="error-page">
    <div class="error-content">
      <div class="maintenance-icon">
        <i class="ri-tools-line"></i>
      </div>
      <h1 class="error-code">{{ t('maintenance') }}</h1>
      <h2 class="error-title">{{ t('siteMaintenance') }}</h2>
      <p class="error-message">
        {{ t('maintenanceMessage') }}
      </p>
      <p class="error-message">
        {{ t('thankYou') }}
      </p>
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

.maintenance-icon {
  font-size: 4rem;
  color: var(--color-secondary);
  margin-bottom: 1rem;
}

.error-code {
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-secondary);
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
  margin-bottom: 1rem;
}
</style>