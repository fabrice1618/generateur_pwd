# TODO - Amélioration du Starter Vue 3

## Priorité Haute (Fonctionnalités Core - 1-2 semaines)

### Authentification & Utilisateur
- [ ] **Créer une vue Profil utilisateur** (facile)
  - Afficher/modifier les infos utilisateur
  - Changer mot de passe
  - Avatar upload
- [ ] **Intégrer une vraie API backend** (moyen)
  - Remplacer les mocks par des appels API réels
  - Gestion des tokens JWT
  - Refresh token automatique
- [ ] **Ajouter la récupération de mot de passe** (facile)
  - Vue "mot de passe oublié"
  - Email de reset (simulation)

### Interface Utilisateur
- [ ] **Créer un Dashboard/Home amélioré** (facile)
  - Cards avec statistiques
  - Graphiques simples (utiliser Chart.js ou ApexCharts)
  - Actions rapides
- [ ] **Améliorer les tables** (moyen)
  - Export CSV/Excel
  - Filtres avancés
  - Tri multi-colonnes
  - Pagination côté serveur

## Priorité Moyenne (Fonctionnalités Avancées - 2-4 semaines)

### Composants UI
- [x] **Ajouter un composant FileUpload** (moyen) ✅ TERMINÉ
  - Drag & drop, validation, preview, upload progress
- [x] **Composant PhoneInput avec validation internationale** (moyen) ✅ TERMINÉ
  - Sélecteur de pays, formatage automatique, validation
- [x] **DateRangePicker** (moyen) ✅ TERMINÉ
  - Sélecteur de plage de dates avec validation
- [x] **ColorPicker** (moyen) ✅ TERMINÉ
  - Sélecteur de couleur avec palette et input hex
- [x] **CheckboxInput & RadioInput** (facile) ✅ TERMINÉ
  - Composants personnalisés pour checkboxes et boutons radio
- [ ] **Composant de Data Visualization** (moyen)
  - Graphiques (lignes, barres, camembert)
  - Intégration Chart.js
- [ ] **Modal système amélioré** (facile)
  - Modals imbriquées
  - Animations fluides
  - Taille dynamique

### Fonctionnalités
- [ ] **Système de notifications push** (difficile)
  - Intégration PWA notifications
  - Centre de notifications in-app
- [ ] **Mode hors ligne** (difficile)
  - Cache des données
  - Sync quand reconnecté
  - Indicateur de statut
- [x] **Recherche globale** (moyen) ✅ TERMINÉ
  - Barre de recherche dans navbar
  - Recherche dans toutes les vues

## Priorité Basse (Optimisations & Qualité - 1-2 semaines)

### Performance & DX
- [ ] **Lazy loading des composants** (facile)
  - Code splitting
  - Images lazy load
- [ ] **Tests unitaires complets** (moyen)
  - Tests pour tous les composants
  - Tests stores Pinia
  - Coverage > 80%
- [ ] **Storybook pour composants** (facile)
  - Documentation interactive
  - Développement isolé

### Accessibilité & SEO
- [ ] **Améliorer l'accessibilité** (moyen)
  - ARIA labels
  - Navigation clavier
  - Screen reader support
- [ ] **SEO et métadonnées** (facile)
  - Meta tags dynamiques
  - Open Graph
  - Sitemap

### Déploiement & CI/CD
- [ ] **Configuration CI/CD** (moyen)
  - GitHub Actions
  - Tests automatiques
  - Build et déploiement
- [ ] **Dockerisation** (facile)
  - Dockerfile optimisé
  - Docker Compose pour dev
- [ ] **Monitoring et logging** (difficile)
  - Sentry pour erreurs
  - Analytics (Matomo/GA4)

## Idées Futures (Priorité Très Basse)
- [ ] **Mode sombre automatique** (facile)
- [ ] **Thème personnalisable par utilisateur** (moyen)
- [ ] **Support multi-tenancy** (difficile)
- [ ] **API GraphQL** (difficile)
- [ ] **Real-time avec WebSockets** (difficile)

## Notes
- **Ordre suggéré**: Commencer par l'authentification complète, puis le dashboard, puis les composants manquants
- **Difficulté**: Basé sur complexité technique et dépendances externes
- **Temps**: Estimations pour un développeur expérimenté
- **Dépendances**: Éviter d'ajouter trop de libs lourdes pour garder le starter léger