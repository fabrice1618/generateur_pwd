<template>
  <div class="layout-default">
    <Header>
      <template #nav>
        <NavBar />
      </template>
      <template #icons>
        <slot name="icons" />
      </template>
    </Header>

    <main class="layout-content">
      <slot />
    </main>

    <!-- Conteneur pour les modales -->
    <div id="modal-container" class="modal-container"></div>

    <div class="layout-footer">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
import NavBar from '@/components/navbar/NavBar.vue'
</script>

<style scoped>
.layout-default{
  display:flex;
  flex-direction:column;
  height: 100vh;
  width: 100%;
  max-width: 600px;
  min-width: 400px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}
.layout-content{
  flex: 1;
  min-height: 0; /* Important pour permettre au flex item de shrink */
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 48px; /* Espace pour le footer */
}

.layout-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
}

.modal-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
}

.modal-container > * {
  pointer-events: auto;
}

@media(min-width:1000px){
  /* example: keep horizontal header on wide screens */
}
</style>
