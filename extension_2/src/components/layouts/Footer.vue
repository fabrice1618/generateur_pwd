<template>
  <footer class="app-footer">
    <p>{{ $t('footerText') }}</p>
  </footer>
</template>

<script setup lang="ts">
// Pas besoin d'imports pour utiliser $t global
</script>

<style scoped>
.app-footer {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(0,0,0,0.04);
  background: var(--surface, #fff);
  color: var(--text-secondary, #666);
  font-size: 12px;
}
</style>
