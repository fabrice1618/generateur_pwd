<template>
  <IconButton
    :size="size"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    <i :class="iconClass"></i>
  </IconButton>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import IconButton from '../buttons/IconButton.vue'

const emit = defineEmits(['click'])

const props = withDefaults(defineProps<{
  iconClass?: string
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}>(), {
  iconClass: '',
  size: 'md',
  ariaLabel: 'icon bar item'
})

const { iconClass, size, ariaLabel } = toRefs(props)

const handleClick = (event: Event) => {
  emit('click', event)
}
</script>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>