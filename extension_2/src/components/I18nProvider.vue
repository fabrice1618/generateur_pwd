<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, watch, provide } from 'vue'
import { useI18n } from 'vue-i18n'

// Injecter la locale du store
const locale = inject('locale')

// Créer une instance i18n locale qui réagit aux changements
const { t, locale: i18nLocale } = useI18n()

// Watcher pour synchroniser la locale locale avec la globale
watch(locale, (newLocale) => {
  if (newLocale) {
    i18nLocale.value = newLocale
  }
}, { immediate: true })

// Fournir les fonctions de traduction aux composants enfants
provide('t', t)
provide('currentLocale', locale)
</script>