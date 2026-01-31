import Analytics from '#models/analytics'
import Link from '#models/link'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

interface RecordClickPayload {
  linkId: string
  referrer?: string | null
  userAgent?: string | null
  ipAddress?: string | null
  country?: string | null
  city?: string | null
  device?: string | null
  browser?: string | null
  os?: string | null
}

export default class AnalyticsService {
  public async recordClick(payload: RecordClickPayload) {
    return Analytics.create(payload)
  }

  public async getOverview(userId: string, days: number = 30) {
    DateTime.now().minus({ days }).toSQL()
    const userLinks = await Link.query().where('userId', userId).select('id')
    const linkIds = userLinks.map((link) => link.id)

    if (linkIds.length === 0) {
      return {
        totalClicks: 0,
        totalLinks: 0,
        clicksToday: 0,
        clicksThisWeek: 0,
        clicksThisMonth: 0,
      }
    }

    const [totalClicks, clicksToday, clicksThisWeek, clicksThisMonth] = await Promise.all([
      Analytics.query().whereIn('linkId', linkIds).count('* as total').first(),
      Analytics.query()
        .whereIn('linkId', linkIds)
        .where('createdAt', '>=', DateTime.now().startOf('day').toSQL())
        .count('* as total')
        .first(),
      Analytics.query()
        .whereIn('linkId', linkIds)
        .where('createdAt', '>=', DateTime.now().startOf('week').toSQL())
        .count('* as total')
        .first(),
      Analytics.query()
        .whereIn('linkId', linkIds)
        .where('createdAt', '>=', DateTime.now().startOf('month').toSQL())
        .count('* as total')
        .first(),
    ])

    return {
      totalClicks: Number(totalClicks?.$extras.total || 0),
      totalLinks: linkIds.length,
      clicksToday: Number(clicksToday?.$extras.total || 0),
      clicksThisWeek: Number(clicksThisWeek?.$extras.total || 0),
      clicksThisMonth: Number(clicksThisMonth?.$extras.total || 0),
    }
  }

  public async getClicksByPeriod(userId: string, days: number = 30) {
    const startDate = DateTime.now().minus({ days })

    const userLinks = await Link.query().where('userId', userId).select('id')
    const linkIds = userLinks.map((link) => link.id)

    if (linkIds.length === 0) {
      return []
    }

    const clicks = await db
      .from('analytics')
      .whereIn('link_id', linkIds)
      .where('created_at', '>=', startDate.toSQL())
      .select(db.raw('DATE(created_at) as date'))
      .count('* as clicks')
      .groupByRaw('DATE(created_at)')
      .orderBy('date', 'asc')

    return clicks.map((row) => ({
      date: row.date,
      clicks: Number(row.clicks),
    }))
  }

  public async getTopLinks(userId: string, limit: number = 10) {
    const userLinks = await Link.query().where('userId', userId).select('id')
    const linkIds = userLinks.map((link) => link.id)

    if (linkIds.length === 0) {
      return []
    }

    const topLinks = await db
      .from('analytics')
      .whereIn('link_id', linkIds)
      .select('link_id')
      .count('* as clicks')
      .groupBy('link_id')
      .orderBy('clicks', 'desc')
      .limit(limit)

    const linkDetails = await Link.query().whereIn(
      'id',
      topLinks.map((l) => l.link_id)
    )

    return topLinks.map((row) => {
      const link = linkDetails.find((l) => l.id === row.link_id)
      return {
        linkId: row.link_id,
        clicks: Number(row.clicks),
        label: link?.label,
        slugAuto: link?.slugAuto,
        slugCustom: link?.slugCustom,
        targetUrl: link?.targetUrl,
      }
    })
  }

  public async getClicksByReferrer(userId: string, limit: number = 10) {
    const userLinks = await Link.query().where('userId', userId).select('id')
    const linkIds = userLinks.map((link) => link.id)

    if (linkIds.length === 0) {
      return []
    }

    const referrers = await db
      .from('analytics')
      .whereIn('link_id', linkIds)
      .whereNotNull('referrer')
      .select('referrer')
      .count('* as clicks')
      .groupBy('referrer')
      .orderBy('clicks', 'desc')
      .limit(limit)

    return referrers.map((row) => ({
      referrer: row.referrer,
      clicks: Number(row.clicks),
    }))
  }

  public async getClicksByCountry(userId: string, limit: number = 10) {
    const userLinks = await Link.query().where('userId', userId).select('id')
    const linkIds = userLinks.map((link) => link.id)

    if (linkIds.length === 0) {
      return []
    }

    const countries = await db
      .from('analytics')
      .whereIn('link_id', linkIds)
      .whereNotNull('country')
      .select('country')
      .count('* as clicks')
      .groupBy('country')
      .orderBy('clicks', 'desc')
      .limit(limit)

    return countries.map((row) => ({
      country: row.country,
      clicks: Number(row.clicks),
    }))
  }

  public async getClicksByDevice(userId: string) {
    const userLinks = await Link.query().where('userId', userId).select('id')
    const linkIds = userLinks.map((link) => link.id)

    if (linkIds.length === 0) {
      return []
    }

    const devices = await db
      .from('analytics')
      .whereIn('link_id', linkIds)
      .whereNotNull('device')
      .select('device')
      .count('* as clicks')
      .groupBy('device')
      .orderBy('clicks', 'desc')

    return devices.map((row) => ({
      device: row.device,
      clicks: Number(row.clicks),
    }))
  }

  public async getClicksByBrowser(userId: string) {
    const userLinks = await Link.query().where('userId', userId).select('id')
    const linkIds = userLinks.map((link) => link.id)

    if (linkIds.length === 0) {
      return []
    }

    const browsers = await db
      .from('analytics')
      .whereIn('link_id', linkIds)
      .whereNotNull('browser')
      .select('browser')
      .count('* as clicks')
      .groupBy('browser')
      .orderBy('clicks', 'desc')

    return browsers.map((row) => ({
      browser: row.browser,
      clicks: Number(row.clicks),
    }))
  }

  public async getLinkAnalytics(linkId: string, userId: string, days: number = 30) {
    const link = await Link.query().where('id', linkId).where('userId', userId).firstOrFail()

    const startDate = DateTime.now().minus({ days })

    const [totalClicks, clicksByDay, referrers, countries, devices, browsers] = await Promise.all([
      Analytics.query().where('linkId', linkId).count('* as total').first(),
      db
        .from('analytics')
        .where('link_id', linkId)
        .where('created_at', '>=', startDate.toSQL())
        .select(db.raw('DATE(created_at) as date'))
        .count('* as clicks')
        .groupByRaw('DATE(created_at)')
        .orderBy('date', 'asc'),
      db
        .from('analytics')
        .where('link_id', linkId)
        .whereNotNull('referrer')
        .select('referrer')
        .count('* as clicks')
        .groupBy('referrer')
        .orderBy('clicks', 'desc')
        .limit(5),
      db
        .from('analytics')
        .where('link_id', linkId)
        .whereNotNull('country')
        .select('country')
        .count('* as clicks')
        .groupBy('country')
        .orderBy('clicks', 'desc')
        .limit(5),
      db
        .from('analytics')
        .where('link_id', linkId)
        .whereNotNull('device')
        .select('device')
        .count('* as clicks')
        .groupBy('device')
        .orderBy('clicks', 'desc'),
      db
        .from('analytics')
        .where('link_id', linkId)
        .whereNotNull('browser')
        .select('browser')
        .count('* as clicks')
        .groupBy('browser')
        .orderBy('clicks', 'desc'),
    ])

    return {
      link: {
        id: link.id,
        label: link.label,
        slugAuto: link.slugAuto,
        slugCustom: link.slugCustom,
        targetUrl: link.targetUrl,
      },
      totalClicks: Number(totalClicks?.$extras.total || 0),
      clicksByDay: clicksByDay.map((row) => ({
        date: row.date,
        clicks: Number(row.clicks),
      })),
      referrers: referrers.map((row) => ({
        referrer: row.referrer,
        clicks: Number(row.clicks),
      })),
      countries: countries.map((row) => ({
        country: row.country,
        clicks: Number(row.clicks),
      })),
      devices: devices.map((row) => ({
        device: row.device,
        clicks: Number(row.clicks),
      })),
      browsers: browsers.map((row) => ({
        browser: row.browser,
        clicks: Number(row.clicks),
      })),
    }
  }
}
