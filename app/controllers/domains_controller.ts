import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Domain from '#models/domain'

export default class DomainsController {
  static validator = vine.compile(
    vine.object({
      name: vine.string(),
      label: vine.string().trim().optional(),
    })
  )

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(DomainsController.validator)

    const domain = await Domain.create(data)

    return response.created({
      message: 'Domaine enregistré',
      domain,
    })
  }
}
