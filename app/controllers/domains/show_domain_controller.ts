import type { HttpContext } from '@adonisjs/core/http'
import Domain from '#models/domain'
import DomainService from '#services/domain_service'

export default class ShowDomainController {
  async show({ params, auth, response, inertia }: HttpContext) {
    const domainId = params.id
    const user = auth.user!

    // Validate user access to domain
    const hasAccess = await DomainService.validateDomainAccess(domainId, user.id)
    if (!hasAccess) {
      return response.status(403).json({
        message: 'Accès refusé à ce domaine',
      })
    }

    const domain = await Domain.query()
      .where('id', domainId)
      .preload('organization')
      .preload('links', (query) => {
        query.orderBy('created_at', 'desc').limit(10)
      })
      .firstOrFail()

    return inertia.render('domains/show', {
      domain,
    })
  }
}
