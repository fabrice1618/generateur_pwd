<template>
  <label class="toggle-switch" :class="{ active: modelValue }">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="toggle-input"
    />
    <span class="toggle-slider"></span>
    <span class="toggle-label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style scoped>
.toggle-switch {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.toggle-switch.active {
  color: var(--text);
}

.toggle-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background: #dc2626; /* Rouge par défaut (off) */
  border-radius: 24px;
  transition: background-color 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-slider {
  background: #10b981; /* Vert quand actif */
}

.toggle-switch.active .toggle-slider::before {
  transform: translateX(20px);
}

.toggle-label {
  flex: 1;
  transition: color 0.2s ease;
}

.toggle-switch:hover .toggle-label {
  color: var(--text);
}

/* Animation smooth pour le toggle */
.toggle-slider {
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-slider::before {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>