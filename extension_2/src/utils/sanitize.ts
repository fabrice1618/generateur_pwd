import DOMPurify from 'dompurify'

export const sanitizeInput = (input: string): string => {
  // Nettoyer le HTML potentiellement dangereux
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Pas de tags HTML autorisés pour les inputs texte
    ALLOWED_ATTR: []
  })
}

export const sanitizeHtml = (html: string): string => {
  // Pour les contenus HTML (comme les descriptions)
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a'],
    ALLOWED_ATTR: ['href', 'target']
  })
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}