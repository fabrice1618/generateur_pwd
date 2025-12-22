<template>
  <div class="layout-sidebar">
    <aside class="sidebar">
      <Header vertical>
        <template #nav>
          <slot name="nav" />
        </template>
        <template #actions>
          <slot name="actions" />
        </template>
      </Header>
    </aside>

    <div class="content-area">
      <main class="layout-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
</script>

<style scoped>
.layout-sidebar{display:flex;height:100vh}
.sidebar{width:220px}
.content-area{flex:1;display:flex;flex-direction:column}
.layout-content{flex:1;padding:12px}
</style>
