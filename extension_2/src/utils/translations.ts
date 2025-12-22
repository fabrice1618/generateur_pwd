// Simple translation system without eval for CSP compatibility
export const translations = {
  fr: {
    welcome: 'Bienvenue',
    error: 'Erreur',
    loading: 'Chargement...',
    home: 'Accueil',
    admin: 'Admin',
    login: 'Connexion',
    loginUser: 'Connexion (user)',
    loginAdmin: 'Connexion (admin)',
    logout: 'Déconnexion',
    status: 'Statut',
    adminLogged: 'Admin connecté',
    userLogged: 'User connecté',
    notLogged: 'Non connecté',
    appTitle: 'VaultPass',
    name: 'Nom',
    enterName: 'Entrez votre nom',
    password: 'Mot de passe',
    enterPassword: 'Entrez votre mot de passe',
    age: 'Âge',
    enterAge: 'Entrez votre âge',
    value: 'Valeur',
    email: 'Email',
    enterEmail: 'Entrez votre email',
    emailPlaceholder: 'votre@email.com',
    country: 'Pays',
    about: 'À propos',
    someWords: 'Quelques mots...',
    agreeTerms: 'J\'accepte les conditions',
    subscribeNewsletter: 'S\'abonner à la newsletter',
    receiveUpdates: 'Recevoir les mises à jour',
    option1: 'Option 1',
    option2: 'Option 2',
    option3: 'Option 3'
  },
  en: {
    welcome: 'Welcome',
    error: 'Error',
    loading: 'Loading...',
    home: 'Home',
    admin: 'Admin',
    login: 'Login',
    loginUser: 'Login (user)',
    loginAdmin: 'Login (admin)',
    logout: 'Logout',
    status: 'Status',
    adminLogged: 'Admin logged in',
    userLogged: 'User logged in',
    notLogged: 'Not logged in',
    appTitle: 'VaultPass',
    name: 'Name',
    enterName: 'Enter your name',
    password: 'Password',
    enterPassword: 'Enter your password',
    age: 'Age',
    enterAge: 'Enter your age',
    value: 'Value',
    email: 'Email',
    enterEmail: 'Enter your email',
    emailPlaceholder: 'your@email.com',
    country: 'Country',
    about: 'About',
    someWords: 'Some words...',
    agreeTerms: 'I agree to the terms',
    subscribeNewsletter: 'Subscribe to newsletter',
    receiveUpdates: 'Receive updates',
    option1: 'Option 1',
    option2: 'Option 2',
    option3: 'Option 3'
  }
}

let currentLocale: 'fr' | 'en' = 'fr'

export function setLocale(locale: 'fr' | 'en') {
  currentLocale = locale
}

export function t(key: string): string {
  return translations[currentLocale][key as keyof typeof translations.fr] || key
}

export function useTranslation() {
  return { t }
}
