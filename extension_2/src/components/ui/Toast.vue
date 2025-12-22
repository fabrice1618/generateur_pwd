<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div" class="toast-group">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
        @click="toast.closeOnClick ? toastStore.removeToast(toast.id) : null"
      >
        <div class="toast-content">
          <i v-if="toast.icon" :class="toast.icon" class="toast-icon"></i>
          <span class="toast-message">{{ toast.message }}</span>
          <button
            v-if="toast.closeButton === 'button'"
            class="toast-close"
            @click.stop="toastStore.removeToast(toast.id)"
          >
            <i class="ri-close-line"></i>
          </button>
        </div>
        <div v-if="!toast.hideProgressBar" class="toast-progress" :style="{ width: progressWidth(toast) + '%' }"></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '../../stores/toast'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const toastStore = useToastStore()
const now = ref(Date.now())

onMounted(() => {
  const interval = setInterval(() => {
    now.value = Date.now()
  }, 50) // Update every 50ms for smooth animation
  onUnmounted(() => clearInterval(interval))
})

const progressWidth = (toast: any) => {
  if (toast.timeout === false) return 100
  const elapsed = now.value - toast.createdAt
  const total = toast.timeout as number
  return Math.max(0, ((total - elapsed) / total) * 100)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  pointer-events: auto;
  min-width: 300px;
  max-width: 500px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toast-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

.toast-progress {
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin-top: 8px;
  transition: width 0.1s linear;
}

/* Colors based on type */
.toast-success {
  background: #10b981;
  color: white;
}

.toast-error {
  background: #ef4444;
  color: white;
}

.toast-warning {
  background: #f59e0b;
  color: white;
}

.toast-info {
  background: #3b82f6;
  color: white;
}

.toast-loading {
  background: #6b7280;
  color: white;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>