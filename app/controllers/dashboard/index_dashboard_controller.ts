import type { HttpContext } from '@adonisjs/core/http'

export default class IndexDashboardController {
  public async handle({ inertia }: HttpContext) {
    return inertia.render('dashboard/index')
  }
}
