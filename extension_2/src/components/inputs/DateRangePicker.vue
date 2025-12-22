<template>
  <div class="date-range-picker">
    <div class="date-inputs">
      <DateInput
        v-model="startDate"
        :label="t('startDate')"
        :placeholder="t('selectStartDate')"
        @update:model-value="onStartDateChange"
      />
      <DateInput
        v-model="endDate"
        :label="t('endDate')"
        :placeholder="t('selectEndDate')"
        @update:model-value="onEndDateChange"
      />
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DateInput from './DateInput.vue'

export interface DateRange {
  start: Date | null
  end: Date | null
}

interface Props {
  modelValue?: DateRange | null
  minDate?: Date
  maxDate?: Date
  required?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: DateRange | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  required: false
})

const emit = defineEmits<Emits>()

const { t } = useI18n()

const startDate = ref<Date | ''>('')
const endDate = ref<Date | ''>('')
const errorMessage = ref('')

// Initialize from modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    startDate.value = newValue.start || ''
    endDate.value = newValue.end || ''
  } else {
    startDate.value = ''
    endDate.value = ''
  }
}, { immediate: true })

function onStartDateChange(value: Date | '') {
  startDate.value = value
  validateAndEmit()
}

function onEndDateChange(value: Date | '') {
  endDate.value = value
  validateAndEmit()
}

function validateAndEmit() {
  errorMessage.value = ''

  const start = startDate.value instanceof Date ? startDate.value : null
  const end = endDate.value instanceof Date ? endDate.value : null

  // Validation
  if (props.required && (!start || !end)) {
    errorMessage.value = t('dateRangeRequired')
    emit('update:modelValue', null)
    return
  }

  if (start && end && start > end) {
    errorMessage.value = t('startDateAfterEndDate')
    emit('update:modelValue', null)
    return
  }

  if (start && props.minDate && start < props.minDate) {
    errorMessage.value = t('dateBeforeMinDate')
    emit('update:modelValue', null)
    return
  }

  if (end && props.maxDate && end > props.maxDate) {
    errorMessage.value = t('dateAfterMaxDate')
    emit('update:modelValue', null)
    return
  }

  const range: DateRange = { start, end }
  emit('update:modelValue', range)
}
</script>

<style scoped>
.date-range-picker {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.error-message {
  color: var(--error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .date-inputs {
    grid-template-columns: 1fr;
  }
}
</style>