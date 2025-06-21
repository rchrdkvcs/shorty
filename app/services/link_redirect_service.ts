import Link from '#models/link'

class LinkRedirectService {
  static getTargetUrl(link: Link, userAgent: string): string {
    const ua = userAgent.toLowerCase()

    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isAndroid = /android/.test(ua)

    if (isIOS && link.iosUrl) {
      return link.iosUrl
    }

    if (isAndroid && link.androidUrl) {
      return link.androidUrl
    }

    return link.fallbackUrl || link.targetUrl
  }
}

export default LinkRedirectService
