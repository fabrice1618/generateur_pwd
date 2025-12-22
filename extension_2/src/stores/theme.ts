import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeType = 'light' | 'dark' | 'blue' | 'green' | 'purple'

export const useThemeStore = defineStore('theme', () => {
  const availableThemes: ThemeType[] = ['light', 'dark', 'blue', 'green', 'purple']

  const initial = (localStorage.getItem('theme') as ThemeType) || 'light'
  const theme = ref<ThemeType>(initial)

  const applyTheme = (t: ThemeType) => {
    if (typeof document !== 'undefined') {
      // Retirer toutes les classes de thème existantes
      document.documentElement.className = document.documentElement.className
        .replace(/theme-\w+/g, '')
        .trim()

      // Ajouter la nouvelle classe de thème
      document.documentElement.classList.add(`theme-${t}`)
      document.documentElement.setAttribute('data-theme', t)
    }
  }

  const setTheme = (t: ThemeType) => {
    if (availableThemes.includes(t)) {
      theme.value = t
      localStorage.setItem('theme', t)
      applyTheme(t)
    }
  }

  const toggleTheme = () => {
    const currentIndex = availableThemes.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % availableThemes.length
    setTheme(availableThemes[nextIndex])
  }

  // Appliquer le thème au démarrage
  applyTheme(theme.value)

  return {
    theme,
    availableThemes,
    setTheme,
    toggleTheme
  }
})
