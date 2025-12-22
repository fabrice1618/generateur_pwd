<template>
  <div class="table-filter">
    <div class="filter-input-group">
      <TextInput
        v-if="column.type === 'text' || !column.type"
        :model-value="tempValue"
        :placeholder="`Filtrer ${column.label.toLowerCase()}`"
        :name="`filter-${column.key}`"
        @update:model-value="tempValue = $event"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
        size="sm"
      />
      <NumberInput
        v-else-if="column.type === 'number'"
        :model-value="tempValue"
        :placeholder="`Filtrer ${column.label.toLowerCase()}`"
        :name="`filter-${column.key}`"
        @update:model-value="tempValue = $event"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
      />
      <select
        v-else-if="column.type === 'boolean'"
        :value="value === true ? 'true' : value === false ? 'false' : ''"
        @change="$emit('update:value', $event.target.value === 'true' ? true : $event.target.value === 'false' ? false : '')"
        class="filter-select"
      >
        <option value="">Tous</option>
        <option value="true">Oui</option>
        <option value="false">Non</option>
      </select>
      <DateInput
        v-else-if="column.type === 'date'"
        :model-value="value"
        :placeholder="`Filtrer ${column.label.toLowerCase()}`"
        :name="`filter-${column.key}`"
        @update:model-value="$emit('update:value', $event)"
      />
      <div class="filter-actions" v-if="column.type === 'text' || column.type === 'number' || !column.type">
        <IconButton
          v-if="hasFocus"
          size="sm"
          aria-label="Appliquer le filtre"
          class="btn-apply"
          @mousedown="console.log('Applying filter for', column.key, 'with value:', tempValue); $emit('update:value', tempValue)"
        >
          <i class="ri-check-line"></i>
        </IconButton>
        <IconButton
          v-if="isFilterActive"
          size="sm"
          aria-label="Supprimer le filtre"
          class="btn-clear"
          @click="$emit('update:value', undefined)"
        >
          <i class="ri-close-line"></i>
        </IconButton>
      </div>
      <!-- Pour les selects et dates, seulement le bouton de suppression -->
      <div class="filter-actions" v-else-if="isFilterActive">
        <IconButton
          size="sm"
          aria-label="Supprimer le filtre"
          class="btn-clear"
          @click="$emit('update:value', undefined)"
        >
          <i class="ri-close-line"></i>
        </IconButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TextInput from '../inputs/TextInput.vue'
import NumberInput from '../inputs/NumberInput.vue'
import DateInput from '../inputs/DateInput.vue'
import IconButton from '../buttons/IconButton.vue'
import type { TableColumn } from './Table.vue'

const props = defineProps<{
  column: TableColumn
  value: any
}>()

const emit = defineEmits<{
  'update:value': [value: any]
}>()

const tempValue = ref(props.value)
const hasFocus = ref(false)

watch(hasFocus, (newValue) => {
  console.log('hasFocus changed for', props.column.key, 'to:', newValue)
})

// Reset temp value when prop value changes
watch(() => props.value, (newValue) => {
  tempValue.value = newValue
})

watch(tempValue, (newValue) => {
  console.log('tempValue changed for', props.column.key, 'to:', newValue)
})

const isFilterActive = computed(() => {
  return props.value !== '' && props.value !== null && props.value !== undefined
})
</script>

<style scoped>
.table-filter {
  width: 100%;
}

.filter-input-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.filter-select,
.filter-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--input-text);
  font-size: 0.9rem;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 2px rgba(23, 93, 220, 0.1);
}

.filter-input::placeholder {
  color: var(--input-placeholder);
}

.btn-apply {
  background-color: var(--primary, #007bff) !important;
  color: white !important;
  border-color: var(--primary, #007bff) !important;
}

.btn-apply:hover {
  background-color: var(--primary-dark, #0056b3) !important;
  border-color: var(--primary-dark, #0056b3) !important;
}

.btn-clear {
  background-color: #dc3545 !important;
  color: white !important;
  border-color: #dc3545 !important;
}

.btn-clear:hover {
  background-color: #c82333 !important;
  border-color: #c82333 !important;
}
</style>