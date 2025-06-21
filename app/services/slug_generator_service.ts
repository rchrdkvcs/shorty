export default class SlugGeneratorService {
  /**
   * Génère un slug alphanumérique (par défaut 8 caractères)
   */
  generate(length: number = 8, options?: { lowercase?: boolean }) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    if (options?.lowercase) {
      chars = chars.toLowerCase()
    }

    let slug = ''
    for (let i = 0; i < length; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return slug
  }
}
