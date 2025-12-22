import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/i18n'

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref('fr')
  const availableLocales = ['fr', 'en']

  const setLocale = (newLocale: string) => {
    if (availableLocales.includes(newLocale)) {
      locale.value = newLocale
      localStorage.setItem('locale', newLocale)

      // Synchroniser avec l'instance vue-i18n globale
      i18n.global.locale.value = newLocale
    }
  }

  const syncLocale = () => {
    const saved = localStorage.getItem('locale')
    if (saved && availableLocales.includes(saved)) {
      locale.value = saved
      // Synchroniser avec l'instance vue-i18n globale
      i18n.global.locale.value = saved
    }
  }

  return {
    locale,
    availableLocales,
    setLocale,
    syncLocale
  }
})