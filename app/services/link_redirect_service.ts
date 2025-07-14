import Link from '#models/link'
import MobileRedirectService from '#services/mobile_redirect_service'

class LinkRedirectService {
  static getTargetUrl(link: Link): string {
    return link.targetUrl
  }

  static getRedirectUrlWithMobileSupport(link: Link): string {
    const config = {
      iosAppId: process.env.IOS_APP_ID,
      androidPackage: process.env.ANDROID_PACKAGE,
      fallbackUrl: link.targetUrl,
    }

    return MobileRedirectService.generateMobileUrl(link.targetUrl, config).fallback
  }
}

export default LinkRedirectService
