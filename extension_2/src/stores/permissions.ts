import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Role = 'admin' | 'user' | 'guest'
export type Permission = 'read' | 'write' | 'delete' | 'admin'

const rolePermissions: Record<Role, Permission[]> = {
  admin: ['read', 'write', 'delete', 'admin'],
  user: ['read', 'write'],
  guest: ['read']
}

export const usePermissionsStore = defineStore('permissions', () => {
  const currentRole = ref<Role>('guest')

  const permissions = computed(() => rolePermissions[currentRole.value])

  const setRole = (role: Role) => {
    currentRole.value = role
  }

  const hasPermission = (permission: Permission): boolean => {
    return permissions.value.includes(permission)
  }

  const can = (permission: Permission): boolean => {
    return hasPermission(permission)
  }

  const isAdmin = computed(() => currentRole.value === 'admin')
  const isUser = computed(() => currentRole.value === 'user')
  const isGuest = computed(() => currentRole.value === 'guest')

  return {
    currentRole,
    permissions,
    setRole,
    hasPermission,
    can,
    isAdmin,
    isUser,
    isGuest
  }
})