import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Domain from '#models/domain'
import DomainService from '#services/domain_service'

export default class UpdateDomainController {
  static validator = vine.compile(
    vine.object({
      name: vine.string().trim().minLength(1),
      description: vine.string().trim().optional(),
      label: vine.string().trim().minLength(1),
      isActive: vine.boolean().optional(),
    })
  )

  async update({ request, response, params, auth }: HttpContext) {
    const domainId = params.id
    const user = auth.user!

    // Validate user access to domain
    const hasAccess = await DomainService.validateDomainAccess(domainId, user.id)
    if (!hasAccess) {
      return response.status(403).json({
        message: 'Accès refusé à ce domaine',
      })
    }

    const data = await request.validateUsing(UpdateDomainController.validator)

    // Check if label is available (excluding current domain)
    if (data.label) {
      const isAvailable = await DomainService.isLabelAvailable(data.label, domainId)
      if (!isAvailable) {
        return response.status(422).json({
          message: 'Ce nom de domaine est déjà utilisé',
        })
      }
    }

    const domain = await Domain.findOrFail(domainId)

    domain.merge({
      name: data.name,
      description: data.description,
      label: data.label?.toLowerCase(),
      isActive: data.isActive ?? domain.isActive,
    })

    await domain.save()

    return response.json({
      message: 'Domaine mis à jour avec succès',
      domain,
    })
  }
}
