<template>
  <router-link :to="to" class="nav-item" active-class="active">
    {{ label }}
  </router-link>
</template>

<script setup lang="ts">
// simple nav item using router-link's active class

const props = defineProps<{
  label: string;
  to: string | object;
}>();
</script>

<style scoped>
.nav-item { padding: 8px 12px; border-radius: 6px; text-decoration: none; color: var(--text); }
.nav-item[aria-current="page"] { background: var(--surface); color: var(--input-text); box-shadow: var(--input-focus-shadow); }
</style>
