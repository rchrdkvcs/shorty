import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import DomainService from '#services/domain_service'
import Organization from '#models/organization'

export default class StoreDomainController {
  static validator = vine.compile(
    vine.object({
      name: vine.string().trim().minLength(1),
      description: vine.string().trim().optional(),
      label: vine.string().trim().minLength(1),
      organizationId: vine.string().uuid(),
    })
  )

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(StoreDomainController.validator)
    const user = auth.user!

    // Validate user access to organization
    const organization = await Organization.query()
      .where('id', data.organizationId)
      .whereHas('users', (userQuery) => {
        userQuery.where('user_id', user.id)
      })
      .first()

    if (!organization) {
      return response.status(403).json({
        message: 'Accès refusé à cette organisation',
      })
    }

    // Check if label is available
    const isAvailable = await DomainService.isLabelAvailable(data.label)
    if (!isAvailable) {
      return response.status(422).json({
        message: 'Ce nom de domaine est déjà utilisé',
      })
    }

    const domain = await DomainService.createDomain({
      name: data.name,
      description: data.description,
      label: data.label,
      organizationId: data.organizationId,
    })

    return response.created({
      message: 'Domaine créé avec succès',
      domain,
    })
  }
}
