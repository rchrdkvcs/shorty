import type { HttpContext } from '@adonisjs/core/http'
import Organization from '#models/organization'

export default class IndexOrganizationController {
  async render({ inertia, auth }: HttpContext) {
    const user = await auth.authenticate()

    const organizations = await Organization.query()
      .whereHas('users', (userQuery) => {
        userQuery.where('user_id', user.id)
      })
      .preload('domains')
      .preload('users')
      .preload('links')
      .withCount('links')
      .withCount('domains')

    return inertia.render('organization/index', {
      organizations,
    })
  }
}
