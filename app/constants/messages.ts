export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials. Please try again.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  LOGIN_SUCCESS: 'Successfully logged in.',
  REGISTRATION_SUCCESS: 'Successfully registered.',
  LOGOUT_SUCCESS: 'Successfully logged out.',
}

export const LINK_MESSAGES = {
  SLUG_EXISTS: 'Un lien avec ce slug existe déjà dans ce domaine.',
  CREATION_SUCCESS: 'Lien créé avec succès.',
  UPDATE_SUCCESS: 'Lien mis à jour avec succès.',
  DELETE_SUCCESS: 'Lien supprimé avec succès.',
  NOT_FOUND: 'Lien non trouvé.',
  UNAUTHORIZED: "Vous n'êtes pas autorisé à modifier ce lien.",
  CREATION_FAILED: 'Erreur lors de la création du lien.',
  UPDATE_FAILED: 'Erreur lors de la mise à jour du lien.',
}

export const DOMAIN_MESSAGES = {
  CREATION_SUCCESS: 'Domaine créé avec succès.',
  UPDATE_SUCCESS: 'Domaine mis à jour avec succès.',
  DELETE_SUCCESS: 'Domaine supprimé avec succès.',
  NOT_FOUND: 'Domaine non trouvé.',
  ALREADY_EXISTS: 'Ce domaine existe déjà.',
}

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est requis.',
  INVALID_EMAIL: "Format d'email invalide.",
  INVALID_URL: "Format d'URL invalide.",
  MIN_LENGTH: 'Ce champ doit contenir au moins {min} caractères.',
  MAX_LENGTH: 'Ce champ ne peut pas contenir plus de {max} caractères.',
}

export const GENERAL_MESSAGES = {
  SERVER_ERROR: 'Une erreur serveur est survenue.',
  NOT_FOUND: 'Ressource non trouvée.',
  FORBIDDEN: 'Accès interdit.',
  SUCCESS: 'Opération réussie.',
  ERROR: 'Une erreur est survenue.',
}
