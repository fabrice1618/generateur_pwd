<template>
  <header :class="['app-header', { vertical }]">
    <router-link to="/" class="brand">VaultPass</router-link>
    <nav class="nav">
      <slot name="nav" />
    </nav>
    <div class="icons">
      <slot name="icons" />
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps({ vertical: { type: Boolean, default: false } })
const vertical = props.vertical
</script>

<style scoped>
.app-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding:12px 16px;
  background: var(--surface, #fff);
  border-bottom: 1px solid rgba(0,0,0,0.04);
}
.app-header.vertical{
  flex-direction:column;
  align-items:flex-start;
  width:220px;
  height:100vh;
  padding:18px 12px;
  border-right: 1px solid rgba(0,0,0,0.06);
}
.brand{font-weight:600; text-decoration:none; color:inherit; cursor:pointer}
.brand:hover{opacity:0.8}
.nav{display:flex; flex:1; justify-content:center; margin: 0 16px}
.app-header.vertical .nav{flex-direction:column}
.icons{display:flex;gap:8px}
.app-header.vertical .icons{margin-top:auto}
</style>
