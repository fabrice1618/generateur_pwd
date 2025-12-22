<template>
  <div class="language-dropdown" :class="{ open: isOpen }">
    <button
      @click="toggleDropdown"
      class="dropdown-trigger"
      :aria-label="`Langue actuelle: ${currentLocale === 'fr' ? 'Français' : 'English'}`"
    >
      <i class="ri-translate-2"></i>
    </button>

    <div v-if="isOpen" class="dropdown-menu" @click.stop>
      <button
        @click="selectLanguage('fr')"
        class="dropdown-item"
        :class="{ active: currentLocale === 'fr' }"
      >
        🇫🇷 Français
      </button>
      <button
        @click="selectLanguage('en')"
        class="dropdown-item"
        :class="{ active: currentLocale === 'en' }"
      >
        🇺🇸 English
      </button>
    </div>

    <!-- Overlay pour fermer au clic extérieur -->
    <div v-if="isOpen" class="dropdown-overlay" @click="closeDropdown"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import { useToast } from 'vue-toastification'

const i18nStore = useI18nStore()
const toast = useToast()
const isOpen = ref(false)

// Forcer la réactivité en créant un computed qui dépend de la locale
const currentLocale = computed(() => {
  // Cette valeur change quand la locale change dans le store
  return i18nStore.locale
})

// Computed pour forcer la mise à jour des traductions
const translations = computed(() => {
  return {
    french: 'Français',
    english: 'English'
  }
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

async function selectLanguage(locale: string) {
  i18nStore.setLocale(locale)
  closeDropdown()

  // Forcer la mise à jour en attendant le prochain tick
  await nextTick()

  toast.success(`Langue changée en ${locale === 'fr' ? translations.value.french : translations.value.english}`)
}

// Fermer au clic extérieur
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.language-dropdown')) {
    closeDropdown()
  }
}
</script>

<style scoped>
.language-dropdown {
  position: relative;
  display: flex;
  align-items: center;
}

.dropdown-trigger {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 18px;
}

.dropdown-trigger:hover {
  background: var(--bg);
  color: var(--text);
}

.dropdown-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background: var(--surface);
  border: 1px solid var(--input-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  min-width: 140px;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  color: var(--text);
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-item:hover {
  background: var(--bg);
}

.dropdown-item.active {
  background: var(--color-primary);
  color: white;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>