<template>
  <div>
    <!-- Modales dynamiques -->
    <component
      v-for="modal in modalStore.modals"
      :key="modal.id"
      :is="getModalComponent(modal)"
      v-bind="modal.props"
      :title="modal.title"
      :content="modal.content"
      :on-confirm="modal.onConfirm"
      :on-cancel="modal.onCancel"
      @close="modalStore.closeModal(modal.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import Modal from './Modal.vue'
import ConfirmModal from './ConfirmModal.vue'
import AlertModal from './AlertModal.vue'
import AddPasswordModal from './AddPasswordModal.vue'

const modalStore = useModalStore()

const getModalComponent = (modal: any) => {
  switch (modal.component) {
    case 'ConfirmModal':
      return ConfirmModal
    case 'AlertModal':
      return AlertModal
    case 'AddPasswordModal':
      return AddPasswordModal
    default:
      return Modal
  }
}
</script>

<style scoped>
/* Le styling est géré par les composants individuels */
</style>