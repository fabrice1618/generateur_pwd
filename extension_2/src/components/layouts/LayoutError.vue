<template>
  <div class="layout-error">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Layout for error pages - no header/footer
</script>

<style scoped>
.layout-error {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
}
</style>