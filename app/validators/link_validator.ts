import vine from '@vinejs/vine'

export default class LinkValidator {
  static validator = vine.compile(
    vine.object({
      slugCustom: vine.string().trim().minLength(3).maxLength(32).optional(),
      targetUrl: vine.string().trim().url(),
      iosUrl: vine.string().trim().url().optional(),
      androidUrl: vine.string().trim().url().optional(),
      fallbackUrl: vine.string().trim().url().optional(),
      name: vine.string().trim().maxLength(100).optional(),
      category: vine.string().trim().maxLength(50).optional(),
      tags: vine.array(vine.string().trim().maxLength(30)).optional(),
    })
  )
}
