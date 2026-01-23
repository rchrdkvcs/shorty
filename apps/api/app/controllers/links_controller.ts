import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import LinkService from '#services/link_service'
import AnalyticsService from '#services/analytics_service'
import vine from '@vinejs/vine'

const createLinkValidator = vine.compile(
  vine.object({
    targetUrl: vine.string().url(),
    slugCustom: vine.string().minLength(3).maxLength(50).optional(),
    label: vine.string().maxLength(100).optional(),
    category: vine.string().maxLength(50).optional(),
  })
)

const updateLinkValidator = vine.compile(
  vine.object({
    targetUrl: vine.string().url().optional(),
    slugCustom: vine.string().minLength(3).maxLength(50).optional().nullable(),
    label: vine.string().maxLength(100).optional().nullable(),
    category: vine.string().maxLength(50).optional().nullable(),
  })
)

@inject()
export default class LinksController {
  constructor(
    protected linkService: LinkService,
    protected analyticsService: AnalyticsService
  ) {}

  public async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.linkService.index(user.id)
  }

  public async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createLinkValidator)
    return this.linkService.store({
      userId: user.id,
      ...payload,
    })
  }

  public async show({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.linkService.show(params.id, user.id)
  }

  public async update({ auth, params, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateLinkValidator)
    return this.linkService.update(params.id, user.id, payload)
  }

  public async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.linkService.destroy(params.id, user.id)
  }

  public async findBySlug({ params, request }: HttpContext) {
    const link = await this.linkService.findBySlug(params.slug)

    const userAgent = request.header('user-agent') || null
    const referrer = request.header('referer') || null
    const ipAddress = request.ip() || null

    const deviceInfo = this.parseUserAgent(userAgent)

    this.analyticsService
      .recordClick({
        linkId: link.id,
        referrer,
        userAgent,
        ipAddress,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
      })
      .catch(() => {})

    return link
  }

  private parseUserAgent(userAgent: string | null): {
    device: string | null
    browser: string | null
    os: string | null
  } {
    if (!userAgent) {
      return { device: null, browser: null, os: null }
    }

    let device: string | null = 'Desktop'
    if (/mobile/i.test(userAgent)) {
      device = 'Mobile'
    } else if (/tablet|ipad/i.test(userAgent)) {
      device = 'Tablet'
    }

    let browser: string | null = null
    if (/chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent)) {
      browser = 'Chrome'
    } else if (/firefox/i.test(userAgent)) {
      browser = 'Firefox'
    } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
      browser = 'Safari'
    } else if (/edge|edg/i.test(userAgent)) {
      browser = 'Edge'
    } else if (/opera|opr/i.test(userAgent)) {
      browser = 'Opera'
    }

    let os: string | null = null
    if (/windows/i.test(userAgent)) {
      os = 'Windows'
    } else if (/macintosh|mac os/i.test(userAgent)) {
      os = 'macOS'
    } else if (/linux/i.test(userAgent) && !/android/i.test(userAgent)) {
      os = 'Linux'
    } else if (/android/i.test(userAgent)) {
      os = 'Android'
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      os = 'iOS'
    }

    return { device, browser, os }
  }
}