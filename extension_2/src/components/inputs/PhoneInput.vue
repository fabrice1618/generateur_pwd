<template>
  <div class="phone-input-container">
    <div class="phone-input-wrapper" :class="{ 'has-error': hasError, 'focused': isFocused }">
      <!-- Country Code Selector -->
      <div class="country-selector" @click="toggleCountryDropdown">
        <div class="selected-country">
          <span class="flag">{{ selectedCountry.flag }}</span>
          <span class="dial-code">+{{ selectedCountry.dialCode }}</span>
          <i class="ri-arrow-down-s-line dropdown-icon" :class="{ 'rotated': showDropdown }" />
        </div>

        <!-- Country Dropdown -->
        <div v-if="showDropdown" class="country-dropdown" ref="dropdownRef">
          <div class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              class="country-search"
              :placeholder="t('searchCountry')"
              @input="filterCountries"
            />
          </div>
          <div class="country-list">
            <div
              v-for="country in filteredCountries"
              :key="country.code"
              class="country-option"
              @click="selectCountry(country)"
            >
              <span class="flag">{{ country.flag }}</span>
              <span class="country-name">{{ country.name }}</span>
              <span class="dial-code">+{{ country.dialCode }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Phone Number Input -->
      <input
        ref="phoneInput"
        v-model="formattedNumber"
        type="tel"
        class="phone-number-input"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <!-- Clear Button -->
      <button
        v-if="clearable && modelValue && !disabled && !readonly"
        type="button"
        class="clear-button"
        @click="clearPhone"
        :aria-label="t('clear')"
      >
        <i class="ri-close-line" />
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="hasError" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Helper Text -->
    <div v-if="helperText && !hasError" class="helper-text">
      {{ helperText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

export interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
  format?: string
  priority?: number
}

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  required?: boolean
  helperText?: string
  defaultCountry?: string
  preferredCountries?: string[]
  onlyCountries?: string[]
  ignoredCountries?: string[]
  autoFormat?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'country-changed', country: Country): void
  (e: 'input', value: string): void
  (e: 'blur'): void
  (e: 'focus'): void
  (e: 'validation-change', isValid: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  readonly: false,
  clearable: false,
  required: false,
  helperText: '',
  defaultCountry: 'FR',
  preferredCountries: () => ['FR', 'US', 'GB', 'DE', 'ES', 'IT'],
  onlyCountries: () => [],
  ignoredCountries: () => [],
  autoFormat: true
})

const emit = defineEmits<Emits>()

const { t } = useI18n()

// Refs
const phoneInput = ref<HTMLInputElement>()
const dropdownRef = ref<HTMLElement>()
const isFocused = ref(false)
const showDropdown = ref(false)
const searchQuery = ref('')
const formattedNumber = ref('')

// Countries data
const countries = ref<Country[]>([
  { code: 'FR', name: 'France', dialCode: '33', flag: '🇫🇷', format: 'XX XX XX XX XX' },
  { code: 'US', name: 'United States', dialCode: '1', flag: '🇺🇸', format: '(XXX) XXX-XXXX' },
  { code: 'GB', name: 'United Kingdom', dialCode: '44', flag: '🇬🇧', format: 'XXXX XXX XXX' },
  { code: 'DE', name: 'Germany', dialCode: '49', flag: '🇩🇪', format: 'XXX XXXXXXXX' },
  { code: 'ES', name: 'Spain', dialCode: '34', flag: '🇪🇸', format: 'XXX XXX XXX' },
  { code: 'IT', name: 'Italy', dialCode: '39', flag: '🇮🇹', format: 'XXX XXX XXXX' },
  { code: 'CA', name: 'Canada', dialCode: '1', flag: '🇨🇦', format: '(XXX) XXX-XXXX' },
  { code: 'AU', name: 'Australia', dialCode: '61', flag: '🇦🇺', format: 'XXXX XXX XXX' },
  { code: 'JP', name: 'Japan', dialCode: '81', flag: '🇯🇵', format: 'XX-XXXX-XXXX' },
  { code: 'CN', name: 'China', dialCode: '86', flag: '🇨🇳', format: 'XXX XXXX XXXX' },
  { code: 'IN', name: 'India', dialCode: '91', flag: '🇮🇳', format: 'XXXXX XXXXX' },
  { code: 'BR', name: 'Brazil', dialCode: '55', flag: '🇧🇷', format: '(XX) XXXXX-XXXX' },
  { code: 'MX', name: 'Mexico', dialCode: '52', flag: '🇲🇽', format: '(XXX) XXX XXXX' },
  { code: 'AR', name: 'Argentina', dialCode: '54', flag: '🇦🇷', format: '(XXX) XXX-XXXX' },
  { code: 'CO', name: 'Colombia', dialCode: '57', flag: '🇨🇴', format: '(XXX) XXX XXXX' },
  { code: 'PE', name: 'Peru', dialCode: '51', flag: '🇵🇪', format: '(XXX) XXX XXX' },
  { code: 'CL', name: 'Chile', dialCode: '56', flag: '🇨🇱', format: 'X XXXX XXXX' },
  { code: 'VE', name: 'Venezuela', dialCode: '58', flag: '🇻🇪', format: '(XXX) XXX XXXX' },
  { code: 'EC', name: 'Ecuador', dialCode: '593', flag: '🇪🇨', format: 'XX XXX XXXX' },
  { code: 'BO', name: 'Bolivia', dialCode: '591', flag: '🇧🇴', format: 'X XXX XXXX' }
])

// Filter countries based on props
const availableCountries = computed(() => {
  let filtered = countries.value

  if (props.onlyCountries.length > 0) {
    filtered = filtered.filter(country => props.onlyCountries.includes(country.code))
  }

  if (props.ignoredCountries.length > 0) {
    filtered = filtered.filter(country => !props.ignoredCountries.includes(country.code))
  }

  return filtered
})

// Selected country
const selectedCountry = ref<Country>(
  availableCountries.value.find(c => c.code === props.defaultCountry) ??
  availableCountries.value.find(c => c.code === 'FR') ??
  availableCountries.value[0] ??
  countries.value[0]!
)

// Filtered countries for dropdown
const filteredCountries = computed(() => {
  if (!searchQuery.value) {
    // Show preferred countries first
    const preferred = availableCountries.value.filter(c =>
      props.preferredCountries.includes(c.code)
    )
    const others = availableCountries.value.filter(c =>
      !props.preferredCountries.includes(c.code)
    )
    return [...preferred, ...others]
  }

  return availableCountries.value.filter(country =>
    country.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    country.dialCode.includes(searchQuery.value) ||
    country.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Validation
const errorMessage = ref('')
const hasError = computed(() => !!errorMessage.value)

// Computed for full phone number
const fullPhoneNumber = computed(() => {
  if (!formattedNumber.value) return ''
  return `+${selectedCountry.value.dialCode}${formattedNumber.value.replace(/\s/g, '')}`
})

// Methods
function toggleCountryDropdown() {
  if (props.disabled || props.readonly) return
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
  searchQuery.value = ''
}

function handleClickOutside(event: Event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

function selectCountry(country: Country) {
  selectedCountry.value = country
  showDropdown.value = false
  searchQuery.value = ''
  validatePhone()
  emit('country-changed', country)
}

function filterCountries() {
  // Filtered countries computed handles this
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '') // Remove non-digits

  if (props.autoFormat && selectedCountry.value.format) {
    value = formatPhoneNumber(value, selectedCountry.value.format)
  }

  formattedNumber.value = value
  emit('input', fullPhoneNumber.value)
  emit('update:modelValue', fullPhoneNumber.value)
  validatePhone()
}

function formatPhoneNumber(value: string, format: string): string {
  let formatted = ''
  let valueIndex = 0

  for (let i = 0; i < format.length && valueIndex < value.length; i++) {
    const char = format[i]
    if (char === 'X') {
      formatted += value[valueIndex]
      valueIndex++
    } else {
      formatted += char
    }
  }

  return formatted
}

function onFocus() {
  isFocused.value = true
  emit('focus')
}

function onBlur() {
  isFocused.value = false
  validatePhone()
  emit('blur')
}

function onKeydown(event: KeyboardEvent) {
  // Allow backspace, delete, tab, escape, enter, arrows
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
  ]

  if (allowedKeys.includes(event.key)) return

  // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
  if (event.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase())) return

  // Allow digits and spaces
  if (!/\d|\s/.test(event.key)) {
    event.preventDefault()
  }
}

function validatePhone(): boolean {
  errorMessage.value = ''

  if (props.required && !formattedNumber.value.trim()) {
    errorMessage.value = t('phoneRequired')
    emit('validation-change', false)
    return false
  }

  if (formattedNumber.value) {
    const digitsOnly = formattedNumber.value.replace(/\D/g, '')
    const minLength = 7 // Minimum international phone number length
    const maxLength = 15 // Maximum international phone number length

    if (digitsOnly.length < minLength) {
      errorMessage.value = t('phoneTooShort')
      emit('validation-change', false)
      return false
    }

    if (digitsOnly.length > maxLength) {
      errorMessage.value = t('phoneTooLong')
      emit('validation-change', false)
      return false
    }
  }

  emit('validation-change', true)
  return true
}

function clearPhone() {
  formattedNumber.value = ''
  emit('update:modelValue', '')
  emit('input', '')
  validatePhone()
}

// Watch for external model changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== fullPhoneNumber.value) {
    // Parse incoming value
    if (newValue && newValue.startsWith('+')) {
      const parts = newValue.substring(1).split(/(\d+)/).filter(Boolean)
      if (parts.length >= 2) {
        const dialCode = parts[0]
        const number = parts.slice(1).join('')

        const country = availableCountries.value.find(c => c.dialCode === dialCode)
        if (country) {
          selectedCountry.value = country
          formattedNumber.value = number
        }
      }
    } else {
      formattedNumber.value = newValue || ''
    }
  }
}, { immediate: true })

// Initialize
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  validatePhone()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.phone-input-container {
  position: relative;
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius);
  background: var(--input-bg);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.phone-input-wrapper.focused {
  border-color: var(--input-focus);
  box-shadow: var(--input-focus-shadow);
}

.phone-input-wrapper.has-error {
  border-color: var(--color-accent);
}

.country-selector {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  cursor: pointer;
  border-right: 1px solid var(--input-border);
  min-width: 120px;
}

.selected-country {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.flag {
  font-size: 1.2em;
}

.dial-code {
  font-weight: 500;
  color: var(--text);
}

.dropdown-icon {
  transition: transform 0.2s ease;
  color: var(--text-secondary);
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.country-dropdown {
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
  overflow: hidden;
  margin-top: 0.25rem;
}

.search-container {
  padding: 0.75rem;
  border-bottom: 1px solid var(--input-border);
}

.country-search {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius);
  background: var(--input-bg);
  color: var(--input-text);
  font-size: 0.875rem;
}

.country-search:focus {
  outline: none;
  border-color: var(--input-focus);
}

.country-list {
  max-height: 200px;
  overflow-y: auto;
}

.country-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.country-option:hover {
  background: var(--surface);
}

.country-name {
  flex: 1;
  font-size: 0.875rem;
}

.phone-number-input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  color: var(--input-text);
  font-size: 1rem;
  outline: none;
}

.phone-number-input::placeholder {
  color: var(--input-placeholder);
}

.phone-number-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;
  margin-right: 0.5rem;
}

.clear-button:hover {
  background: var(--surface);
  color: var(--text);
}

.error-message {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-accent);
}

.helper-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 480px) {
  .country-selector {
    min-width: 100px;
  }

  .selected-country {
    gap: 0.25rem;
  }

  .dial-code {
    font-size: 0.8rem;
  }
}
</style>