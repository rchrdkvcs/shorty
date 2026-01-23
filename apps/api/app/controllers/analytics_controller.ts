import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AnalyticsService from '#services/analytics_service'

@inject()
export default class AnalyticsController {
  constructor(protected analyticsService: AnalyticsService) {}

  public async overview({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const days = Number(request.input('days', 30))
    return this.analyticsService.getOverview(user.id, days)
  }

  public async clicksByPeriod({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const days = Number(request.input('days', 30))
    return this.analyticsService.getClicksByPeriod(user.id, days)
  }

  public async topLinks({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const limit = Number(request.input('limit', 10))
    return this.analyticsService.getTopLinks(user.id, limit)
  }

  public async clicksByReferrer({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const limit = Number(request.input('limit', 10))
    return this.analyticsService.getClicksByReferrer(user.id, limit)
  }

  public async clicksByCountry({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const limit = Number(request.input('limit', 10))
    return this.analyticsService.getClicksByCountry(user.id, limit)
  }

  public async clicksByDevice({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.analyticsService.getClicksByDevice(user.id)
  }

  public async clicksByBrowser({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.analyticsService.getClicksByBrowser(user.id)
  }

  public async linkAnalytics({ auth, params, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const days = Number(request.input('days', 30))
    return this.analyticsService.getLinkAnalytics(params.id, user.id, days)
  }
}
