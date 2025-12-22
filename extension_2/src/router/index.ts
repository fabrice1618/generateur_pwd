import { createRouter, createWebHashHistory } from 'vue-router'
import { mapMetaToMiddleware, runMiddlewareList, withLoader } from './guards'
import { HomeView, AdminView, LoginView, RegisterView, PasswordsView, GeneratorView, AccountView, NotFound, Unauthorized, Maintenance } from '../views'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: false, title: 'Accueil', description: 'Page d\'accueil de l\'application' } },
  { path: '/login', name: 'login', component: LoginView, meta: { requiresAuth: false, title: 'Connexion', description: 'Page de connexion à votre compte' } },
  { path: '/register', name: 'register', component: RegisterView, meta: { requiresAuth: false, title: 'Inscription', description: 'Créer un nouveau compte' } },
  { path: '/generator', name: 'generator', component: GeneratorView, meta: { requiresAuth: false, title: 'Générateur', description: 'Générer un mot de passe sécurisé' } },
  { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true, title: 'Administration', description: 'Panneau d\'administration' } },
  { path: '/passwords', name: 'passwords', component: PasswordsView, meta: { requiresAuth: true, title: 'Mes mots de passe', description: 'Gérer vos mots de passe enregistrés' } },
  { path: '/account', name: 'account', component: AccountView, meta: { requiresAuth: true, title: 'Mon compte', description: 'Informations de votre compte' } },
  { path: '/unauthorized', name: 'unauthorized', component: Unauthorized, meta: { layout: 'error', title: 'Accès refusé', description: 'Vous n\'avez pas les permissions nécessaires' } },
  { path: '/maintenance', name: 'maintenance', component: Maintenance, meta: { layout: 'error', title: 'Maintenance', description: 'Site en maintenance' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { layout: 'error', title: 'Page non trouvée', description: 'La page demandée n\'existe pas' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, _from, next) => {
  // determine middleware list from meta
  const list = mapMetaToMiddleware(to)

  // run middleware with loader wrapping (so loader is shown while async checks run)
  const result = await withLoader(async () => runMiddlewareList(list, to))
  if (result === true) return next()
  if (result === false) return next({ name: 'home' })
  if (typeof result === 'object' && result && 'path' in result) return next(result)
  next()
})

router.afterEach(() => {
  // nothing here — loader handled by withLoader helper in guards
})

router.onError(async () => {
  // hide loader if necessary
  try {
    const mod = await import('@/stores/loader')
    const loader = mod.useLoaderStore()
    loader.hide()
  } catch {}
})

export default router
