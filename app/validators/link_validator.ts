import vine from '@vinejs/vine'

export default class LinkValidator {
  static validator = vine.compile(
    vine.object({
      slugCustom: vine.string().trim().minLength(3).maxLength(32).optional(),
      targetUrl: vine.string().trim().url(),
      name: vine.string().trim().maxLength(100).optional(),
      category: vine.string().trim().maxLength(50).optional(),
      tags: vine.array(vine.string().trim().maxLength(30)).optional(),
      domainId: vine.string().trim().fixedLength(26).optional(),
      organizationId: vine.string().trim().fixedLength(26),
    })
  )
}
