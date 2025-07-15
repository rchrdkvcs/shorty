import type { HttpContext } from '@adonisjs/core/http'
import Link from '#models/link'
import DomainService from '#services/domain_service'

export default class IndexLinkController {
  async render({ inertia, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const organizationId = request.input('organizationId')

    // Récupérer les organisations de l'utilisateur
    await user.load('organizations')
    const userOrganizations = user.organizations

    // Si aucune organisation n'est spécifiée, rediriger vers la première
    if (!organizationId && userOrganizations.length > 0) {
      const firstOrganization = userOrganizations[0]
      return response.redirect(`/dashboard/links?organizationId=${firstOrganization.id}`)
    }

    // Si l'utilisateur n'a pas d'organisation, créer une organisation Personal
    if (userOrganizations.length === 0) {
      const Organization = (await import('#models/organization')).default
      const personalOrganization = await Organization.create({
        name: 'Personal',
        description: 'Organisation personnelle',
      })
      await user.related('organizations').attach([personalOrganization.id])
      return response.redirect(`/dashboard/links?organizationId=${personalOrganization.id}`)
    }

    let linksQuery = Link.query()
      .preload('domain')
      .preload('organization')
      .where('organization_id', organizationId)
      .whereHas('organization', (orgQuery) => {
        orgQuery.whereHas('users', (userQuery) => {
          userQuery.where('user_id', user.id)
        })
      })

    const links = await linksQuery.orderBy('created_at', 'desc')

    const availableDomains = await DomainService.getAvailableDomainsForUser(user.id)

    return inertia.render('link/index', {
      links,
      availableDomains,
      currentOrganizationId: organizationId,
      organizations: userOrganizations,
    })
  }
}
