# Vue 3 + TypeScript + Vite Starter

This starter template provides a modern, production-ready foundation for Vue 3 applications with TypeScript, featuring PWA support, internationalization, theming, and a comprehensive component library.

## Features

### Core
- **Vue 3** with Composition API and `<script setup>` syntax
- **TypeScript** for type safety
- **Vite** for fast development and optimized builds
- **PWA** support with installable app functionality

### State Management
- **Pinia** stores for:
  - Session management (login/logout)
  - Permissions system (role-based access)
  - Modal management (dynamic modals)
  - Theme switching (light/dark/blue/green/purple)
  - Internationalization (i18n)
  - Global loader

### Routing & Guards
- **Vue Router** with permission-based guards
- Support for `requiresAuth`, `requiresAdmin`, `requiresWrite`, `requiresDelete` meta

### UI Components
- **Modals**: Alert, Confirm, Custom modals with store integration
- **Inputs**: Text, Email, Password, Number, Select, Textarea with VeeValidate
- **Buttons**: Primary, Secondary, Ghost variants with sizes
- **Layouts**: Default, Error, Sidebar layouts
- **Navigation**: Navbar with theme/language switchers
- **Tables**: Advanced data tables with sorting, filtering, pagination
- **Notifications**: Toast system with success/error/warning/info types

### Utilities
- **API Cache** with TTL support
- **Input sanitization** for security
- **Toast notifications** with vue-toastification
- **RemixIcon** for consistent iconography

### Development
- **ESLint** ready (add config as needed)
- **Vitest** for testing (add tests as needed)
- **Hot reload** and fast builds

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── modals/         # Modal components
│   ├── inputs/         # Form inputs
│   ├── buttons/        # Button components
│   ├── layouts/        # Layout components
│   ├── navbar/         # Navigation components
│   └── tables/         # Table components with sorting/filtering
├── composables/        # Vue composables
├── stores/             # Pinia stores
├── router/             # Vue Router configuration
├── views/              # Page components
├── utils/              # Utility functions
├── i18n/               # Internationalization
└── styles/             # Global styles and variables
```

## Key Concepts

### Permissions System
Uses role-based permissions with stores:
- `guest`: read only
- `user`: read + write
- `admin`: all permissions

### Modal System
Dynamic modals via store:
```ts
// Open a confirm modal
modalStore.confirmModal('Title', 'Message', onConfirm, onCancel)

// Open custom modal
modalStore.openModal({
  component: 'CustomModal',
  props: { data }
})
```

### Theming
Multiple themes with CSS variables:
- Automatic theme application
- Persistent theme storage

### PWA
- Installable on supported browsers
- Service worker for caching
- Custom install button

### Advanced Table Component
```vue
<Table :columns="columns" :data="data" :page-size="10">
  <!-- Automatic sorting, filtering, pagination -->
</Table>
```

Features:
- Column-based sorting (click headers)
- Dynamic filtering (inputs under headers, type-aware)
- Pagination with customizable page sizes
- Row counter and filter clearing
- Custom formatters and column types

### Toast Notifications
```ts
const toast = useToast()
toast.success('Operation completed!')
toast.error('Something went wrong')
```

## Customization

### Adding New Permissions
1. Update `Permission` type in `stores/permissions.ts`
2. Add to `rolePermissions` object
3. Use in guards: `meta: { requiresYourPermission: true }`

### Adding New Themes
1. Add theme colors in `styles/variables.css`
2. Update `ThemeType` in `stores/theme.ts`
3. Add to `availableThemes` array

### Adding Languages
1. Add translations in `i18n/index.ts`
2. Update `availableLocales` in `stores/i18n.ts`

## Deployment

For PWA to work in production:
- Deploy to HTTPS domain
- Ensure service worker is served correctly
- Test installation on target devices

## Contributing

This is a starter template - customize it for your needs!

Learn more about the [Vue Docs](https://vuejs.org/) and [Vite](https://vite.dev/).
