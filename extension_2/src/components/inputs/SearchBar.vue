<template>
  <div class="search-bar-container">
    <div class="search-bar-wrapper" :class="{ 'focused': isFocused }">
      <i class="ri-search-line search-icon" />
      <input
        ref="searchInput"
        v-model="query"
        type="text"
        class="search-input"
        :placeholder="translatedPlaceholder"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />
      <button
        v-if="query"
        type="button"
        class="clear-button"
        @click="clearSearch"
        :aria-label="t('clear')"
      >
        <i class="ri-close-line" />
      </button>
    </div>

    <!-- Suggestions Dropdown -->
    <div v-if="showSuggestions && filteredSuggestions.length > 0" class="suggestions-dropdown">
      <div
        v-for="suggestion in filteredSuggestions"
        :key="suggestion.id"
        class="suggestion-item"
        @click="selectSuggestion(suggestion)"
      >
        <div class="suggestion-content">
          <div class="suggestion-title">{{ suggestion.title }}</div>
          <div class="suggestion-description">{{ suggestion.description }}</div>
        </div>
        <div class="suggestion-icon">
          <i :class="suggestion.icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export interface SearchSuggestion {
  id: string
  title: string
  description: string
  icon: string
  action: () => void
}

interface Props {
  placeholder?: string
  suggestions?: SearchSuggestion[]
  autoSuggestions?: boolean
}

interface Emits {
  (e: 'search', query: string): void
  (e: 'suggestion-selected', suggestion: SearchSuggestion): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  suggestions: () => [],
  autoSuggestions: true
})

const emit = defineEmits<Emits>()

const { t } = useI18n()
const router = useRouter()

// Refs
const searchInput = ref<HTMLInputElement>()
const isFocused = ref(false)
const showSuggestions = ref(false)
const query = ref('')

// Computed
const filteredSuggestions = computed(() => {
  if (!query.value.trim()) return []

  const searchTerm = query.value.toLowerCase()
  return props.suggestions.filter(suggestion =>
    suggestion.title.toLowerCase().includes(searchTerm) ||
    suggestion.description.toLowerCase().includes(searchTerm)
  ).slice(0, 5) // Limite à 5 résultats
})

const translatedPlaceholder = computed(() => props.placeholder === 'Search...' ? t('searchPlaceholder') : props.placeholder)

// Auto-suggestions basées sur les routes
const autoSuggestions = computed((): SearchSuggestion[] => {
  if (!props.autoSuggestions) return []

  const routes = router.getRoutes()
  return routes
    .filter(route => route.name && route.meta?.title)
    .map(route => ({
      id: route.name as string,
      title: route.meta!.title as string,
      description: `Aller à ${route.path}`,
      icon: 'ri-link',
      action: () => router.push({ name: route.name })
    }))
})

// Combined suggestions
const allSuggestions = computed(() => [
  ...props.suggestions,
  ...autoSuggestions.value
])

// Methods
function onInput() {
  showSuggestions.value = true
  emit('search', query.value)
}

function onFocus() {
  isFocused.value = true
  if (query.value.trim()) {
    showSuggestions.value = true
  }
}

function onBlur() {
  // Delay to allow click on suggestions
  setTimeout(() => {
    isFocused.value = false
    showSuggestions.value = false
  }, 150)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    clearSearch()
    searchInput.value?.blur()
  } else if (event.key === 'Enter') {
    if (filteredSuggestions.value.length > 0) {
      const firstSuggestion = filteredSuggestions.value[0]
      if (firstSuggestion) {
        selectSuggestion(firstSuggestion)
      }
    } else {
      emit('search', query.value)
    }
  }
}

function selectSuggestion(suggestion: SearchSuggestion) {
  query.value = suggestion.title
  showSuggestions.value = false
  suggestion.action()
  emit('suggestion-selected', suggestion)
}

function clearSearch() {
  query.value = ''
  showSuggestions.value = false
  emit('search', '')
}

// Watch for external query changes
watch(() => props.suggestions, () => {
  // Update suggestions when props change
}, { deep: true })

// Initialize
onMounted(() => {
  // Focus input if needed
})
</script>

<style scoped>
.search-bar-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-bar-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius);
  background: var(--input-bg);
  padding: 0.5rem 0.75rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-bar-wrapper.focused {
  border-color: var(--input-focus);
  box-shadow: var(--input-focus-shadow);
}

.search-icon {
  color: var(--text-secondary);
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--input-text);
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--input-placeholder);
}

.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.clear-button:hover {
  background: var(--surface);
  color: var(--text);
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg);
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 0.25rem;
}

.suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background: var(--surface);
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.suggestion-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.suggestion-icon {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .search-bar-container {
    max-width: 100%;
  }

  .suggestions-dropdown {
    max-height: 200px;
  }
}
</style>