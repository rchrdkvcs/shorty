import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AnalyticsService from '#services/analytics_service'

@inject()
export default class IndexAnalyticsController {
  constructor(protected analyticsService: AnalyticsService) {}

  public async handle({ auth, request, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const days = Number(request.input('days', 30))
    const overview = await this.analyticsService.getOverview(user.id, days)
    const clicksByPeriod = await this.analyticsService.getClicksByPeriod(user.id, days)
    const topLinks = await this.analyticsService.getTopLinks(user.id, 5)
    const clicksByReferrer = await this.analyticsService.getClicksByReferrer(user.id, 5)
    const clicksByDevice = await this.analyticsService.getClicksByDevice(user.id)
    const clicksByBrowser = await this.analyticsService.getClicksByBrowser(user.id)

    return inertia.render('analytics/index', {
      overview,
      clicksByPeriod,
      topLinks,
      clicksByReferrer,
      clicksByDevice,
      clicksByBrowser,
    })
  }
}
