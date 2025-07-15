import type { HttpContext } from '@adonisjs/core/http'
import DomainService from '#services/domain_service'

export default class IndexDomainController {
  async index({ auth, request, inertia }: HttpContext) {
    const user = auth.user!
    const organizationId = request.param('organizationId')

    if (organizationId) {
      const domains = await DomainService.getOrganizationDomains(organizationId)
      return inertia.render('domains/index', {
        domains,
        organizationId,
      })
    }

    const domains = await DomainService.getAvailableDomainsForUser(user.id)
    return inertia.render('domains/index', {
      domains,
    })
  }
}
