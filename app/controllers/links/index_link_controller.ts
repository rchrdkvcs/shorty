import type { HttpContext } from '@adonisjs/core/http'
import Link from '#models/link'
import DomainService from '#services/domain_service'
import Organization from '#models/organization'

export default class IndexLinkController {
  async render({ inertia, auth }: HttpContext) {
    const user = await auth.authenticate()

    const links = await Link.query()
      .preload('domain')
      .preload('organization')
      .whereHas('organization', (orgQuery) => {
        orgQuery.whereHas('users', (userQuery) => {
          userQuery.where('user_id', user.id)
        })
      })

    const availableDomains = await DomainService.getAvailableDomainsForUser(user.id)

    const organizations = await Organization.query().whereHas('users', (userQuery) => {
      userQuery.where('user_id', user.id)
    })

    return inertia.render('link/index', {
      links,
      availableDomains,
      organizations,
    })
  }
}
