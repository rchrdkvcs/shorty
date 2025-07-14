import { HttpContext } from '@adonisjs/core/http'

export interface MobileAppConfig {
  iosAppId?: string
  androidPackage?: string
  fallbackUrl?: string
}

export default class MobileRedirectService {
  static detectDevice(userAgent: string): 'ios' | 'android' | 'desktop' {
    const ua = userAgent.toLowerCase()

    if (/iphone|ipad|ipod/.test(ua)) {
      return 'ios'
    }

    if (/android/.test(ua)) {
      return 'android'
    }

    return 'desktop'
  }

  static generateMobileUrl(
    targetUrl: string,
    config: MobileAppConfig = {}
  ): {
    ios: string
    android: string
    fallback: string
  } {
    const fallbackUrl = config.fallbackUrl || targetUrl

    let iosUrl = fallbackUrl
    let androidUrl = fallbackUrl

    if (config.iosAppId) {
      const encodedUrl = encodeURIComponent(targetUrl)
      iosUrl = `https://apps.apple.com/app/id${config.iosAppId}?pt=123456&ct=shorty&mt=8&url=${encodedUrl}`
    }

    if (config.androidPackage) {
      const encodedUrl = encodeURIComponent(targetUrl)
      androidUrl = `https://play.google.com/store/apps/details?id=${config.androidPackage}&referrer=utm_source%3Dshorty%26utm_medium%3Dlink%26url%3D${encodedUrl}`
    }

    return {
      ios: iosUrl,
      android: androidUrl,
      fallback: fallbackUrl,
    }
  }

  static getRedirectUrl(ctx: HttpContext, targetUrl: string, config: MobileAppConfig = {}): string {
    const userAgent = ctx.request.header('user-agent') || ''
    const device = this.detectDevice(userAgent)
    const urls = this.generateMobileUrl(targetUrl, config)

    switch (device) {
      case 'ios':
        return urls.ios
      case 'android':
        return urls.android
      default:
        return urls.fallback
    }
  }

  static createUniversalLink(targetUrl: string, config: MobileAppConfig = {}): string {
    const baseUrl = new URL(targetUrl)
    const urls = this.generateMobileUrl(targetUrl, config)

    if (config.iosAppId || config.androidPackage) {
      baseUrl.searchParams.set('ios_fallback', urls.ios)
      baseUrl.searchParams.set('android_fallback', urls.android)
    }

    return baseUrl.toString()
  }
}
