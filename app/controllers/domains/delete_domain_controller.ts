import type { HttpContext } from '@adonisjs/core/http'
import Domain from '#models/domain'
import DomainService from '#services/domain_service'

export default class DeleteDomainController {
  async delete({ response, params, auth }: HttpContext) {
    const domainId = params.id
    const user = auth.user!

    // Validate user access to domain
    const hasAccess = await DomainService.validateDomainAccess(domainId, user.id)
    if (!hasAccess) {
      return response.status(403).json({
        message: 'Accès refusé à ce domaine',
      })
    }

    const domain = await Domain.findOrFail(domainId)

    // Check if domain has associated links
    await domain.load('links')
    if (domain.links.length > 0) {
      return response.status(422).json({
        message: 'Impossible de supprimer un domaine qui contient des liens',
      })
    }

    await domain.delete()

    return response.json({
      message: 'Domaine supprimé avec succès',
    })
  }
}
