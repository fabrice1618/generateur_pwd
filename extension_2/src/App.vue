<script setup lang="ts">
import { onMounted, provide, readonly } from 'vue'
import IconBar from './components/navbar/IconBar.vue'
import LayoutDefault from './components/layouts/LayoutDefault.vue'
import LayoutError from './components/layouts/LayoutError.vue'
import { useTranslation } from './utils/translations'
import ModalManager from './components/modals/ModalManager.vue'
import Loader from './components/ui/Loader.vue'
import Toast from './components/ui/Toast.vue'
import { useI18nStore } from './stores/i18n'

const { t } = useTranslation()
const i18nStore = useI18nStore()

// Fournir la locale réactive à tous les composants enfants
provide('locale', readonly(i18nStore.locale))

onMounted(() => {
  document.title = t('appTitle')
})
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <component :is="route.meta.layout === 'error' ? LayoutError : LayoutDefault">
      <template #icons v-if="route.meta.layout !== 'error'">
        <IconBar />
      </template>

      <component :is="Component" />
    </component>

    <!-- Gestionnaire de modales global -->
    <ModalManager />

    <!-- Gestionnaire de toasts global -->
    <Toast />
  </router-view>

  <Loader />
</template>

