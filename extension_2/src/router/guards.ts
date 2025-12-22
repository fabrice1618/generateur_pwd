import type { RouteLocationNormalized } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { usePermissionsStore } from '@/stores/permissions'
import useLoaderStore from '@/stores/loader'

type Middleware = (to: RouteLocationNormalized) => Promise<boolean | { path: string } | void> | boolean | { path: string } | void

/** Registry of middleware functions by name. Add more here as needed. */
const registry: Record<string, Middleware> = {
  auth: async (_to) => {
    const store = useSessionStore()
    // Simulate delay to show loader
    await new Promise(resolve => setTimeout(resolve, 300))
    if (!store.isLogged) return { path: '/login' }
  },
  admin: async () => {
    const permissions = usePermissionsStore()
    if (!permissions.can('admin')) return { path: '/unauthorized' }
  },
  write: async () => {
    const permissions = usePermissionsStore()
    if (!permissions.can('write')) return { path: '/unauthorized' }
  },
  delete: async () => {
    const permissions = usePermissionsStore()
    if (!permissions.can('delete')) return { path: '/unauthorized' }
  }
}

export async function runMiddlewareList(middleware: string[] | undefined, to: RouteLocationNormalized) {
  if (!middleware || middleware.length === 0) return true

  for (const name of middleware) {
    const fn = registry[name]
    if (!fn) continue
    const res = await Promise.resolve(fn(to))
    if (res === false) return false
    if (typeof res === 'object' && res !== null && 'path' in res) return res
  }

  return true
}

export function mapMetaToMiddleware(to: RouteLocationNormalized) {
  // support explicit meta.middleware array or shorthand meta.requiresAuth/meta.requiresAdmin
  const m: string[] = []
  const meta: any = to.meta || {}
  if (meta.middleware && Array.isArray(meta.middleware)) m.push(...meta.middleware)
  if (meta.requiresAuth) m.push('auth')
  if (meta.requiresAdmin) m.push('admin')
  if (meta.requiresWrite) m.push('write')
  if (meta.requiresDelete) m.push('delete')
  return m
}

export async function withLoader<T>(fn: () => Promise<T>) {
  const loader = useLoaderStore()
  try {
    loader.show()
    return await fn()
  } finally {
    setTimeout(() => loader.hide(), 60)
  }
}

export default registry
