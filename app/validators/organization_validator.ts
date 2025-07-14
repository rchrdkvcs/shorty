import vine from '@vinejs/vine'

export default class OrganizationValidator {
  static validator = vine.compile(
    vine.object({
      name: vine.string().trim().minLength(2).maxLength(100),
      description: vine.string().trim().maxLength(500).optional(),
      logoUrl: vine.string().trim().url().optional(),
    })
  )
}
