import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)

  // Breakpoints personnalisables
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1440
  }

  // États computed pour les tailles
  const isMobile = computed(() => windowWidth.value < breakpoints.mobile)
  const isTablet = computed(() => windowWidth.value >= breakpoints.mobile && windowWidth.value < breakpoints.tablet)
  const isDesktop = computed(() => windowWidth.value >= breakpoints.tablet)
  const isLargeDesktop = computed(() => windowWidth.value >= breakpoints.desktop)

  // Classes CSS dynamiques
  const layoutClass = computed(() => {
    if (isMobile.value) return 'layout-mobile'
    if (isTablet.value) return 'layout-tablet'
    if (isLargeDesktop.value) return 'layout-large-desktop'
    return 'layout-desktop'
  })

  // Méthode pour mettre à jour les dimensions
  const updateDimensions = () => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  // Initialisation de l'écouteur resize
  const initResizeListener = () => {
    window.addEventListener('resize', updateDimensions)
  }

  // Cleanup (à appeler si nécessaire)
  const removeResizeListener = () => {
    window.removeEventListener('resize', updateDimensions)
  }

  return {
    windowWidth,
    windowHeight,
    breakpoints,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    layoutClass,
    updateDimensions,
    initResizeListener,
    removeResizeListener
  }
})