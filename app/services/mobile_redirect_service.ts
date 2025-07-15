import { HttpContext } from '@adonisjs/core/http'

export interface MobileAppConfig {
  iosAppId?: string
  androidPackage?: string
  fallbackUrl?: string
  deepLinkScheme?: string
  universalLinkDomain?: string
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

    // Try deep links first based on URL patterns
    const deepLinkUrls = this.generateDeepLinkUrls(targetUrl, config)
    if (deepLinkUrls.ios) {
      iosUrl = deepLinkUrls.ios
    }
    if (deepLinkUrls.android) {
      androidUrl = deepLinkUrls.android
    }

    // Fallback to store links if no deep links generated
    if (iosUrl === fallbackUrl && config.iosAppId) {
      const encodedUrl = encodeURIComponent(targetUrl)
      iosUrl = `https://apps.apple.com/app/id${config.iosAppId}?pt=123456&ct=shorty&mt=8&url=${encodedUrl}`
    }

    if (androidUrl === fallbackUrl && config.androidPackage) {
      const encodedUrl = encodeURIComponent(targetUrl)
      androidUrl = `https://play.google.com/store/apps/details?id=${config.androidPackage}&referrer=utm_source%3Dshorty%26utm_medium%3Dlink%26url%3D${encodedUrl}`
    }

    return {
      ios: iosUrl,
      android: androidUrl,
      fallback: fallbackUrl,
    }
  }

  static generateDeepLinkUrls(
    targetUrl: string,
    config: MobileAppConfig = {}
  ): {
    ios: string | null
    android: string | null
  } {
    const url = new URL(targetUrl)
    const domain = url.hostname.toLowerCase()

    // YouTube
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      const videoId = this.extractYouTubeVideoId(targetUrl)
      if (videoId) {
        return {
          ios: `youtube://watch?v=${videoId}`,
          android: `vnd.youtube:${videoId}`,
        }
      }
    }

    // Discord
    if (domain.includes('discord.com') || domain.includes('discord.gg')) {
      const inviteCode = this.extractDiscordInvite(targetUrl)
      if (inviteCode) {
        return {
          ios: `discord://invite/${inviteCode}`,
          android: `discord://invite/${inviteCode}`,
        }
      }
      // For channel/guild links
      const channelMatch = targetUrl.match(/\/channels\/(\d+)\/(\d+)/)
      if (channelMatch) {
        const [, guildId, channelId] = channelMatch
        return {
          ios: `discord://channels/${guildId}/${channelId}`,
          android: `discord://channels/${guildId}/${channelId}`,
        }
      }
    }

    // Instagram
    if (domain.includes('instagram.com')) {
      const path = url.pathname
      return {
        ios: `instagram://user?username=${path.split('/')[1]}`,
        android: `intent://user?username=${path.split('/')[1]}#Intent;package=com.instagram.android;scheme=instagram;end`,
      }
    }

    // Twitter/X
    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      const path = url.pathname
      if (path.includes('/status/')) {
        const tweetId = path.split('/status/')[1]
        return {
          ios: `twitter://status?id=${tweetId}`,
          android: `twitter://status?id=${tweetId}`,
        }
      }
      const username = path.split('/')[1]
      return {
        ios: `twitter://user?screen_name=${username}`,
        android: `twitter://user?screen_name=${username}`,
      }
    }

    // TikTok
    if (domain.includes('tiktok.com')) {
      const path = url.pathname
      if (path.includes('/video/')) {
        const videoId = path.split('/video/')[1]
        return {
          ios: `tiktok://video/${videoId}`,
          android: `tiktok://video/${videoId}`,
        }
      }
      const username = path.split('/')[1]?.replace('@', '')
      return {
        ios: `tiktok://user/${username}`,
        android: `tiktok://user/${username}`,
      }
    }

    // Spotify
    if (domain.includes('spotify.com')) {
      const spotifyId = targetUrl.match(/\/([a-zA-Z]+)\/([a-zA-Z0-9]+)/)
      if (spotifyId) {
        const [, type, id] = spotifyId
        return {
          ios: `spotify:${type}:${id}`,
          android: `spotify:${type}:${id}`,
        }
      }
    }

    // Custom deep link scheme
    if (config.deepLinkScheme) {
      const encodedUrl = encodeURIComponent(targetUrl)
      return {
        ios: `${config.deepLinkScheme}://open?url=${encodedUrl}`,
        android: `${config.deepLinkScheme}://open?url=${encodedUrl}`,
      }
    }

    return {
      ios: null,
      android: null,
    }
  }

  static extractYouTubeVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  static extractDiscordInvite(url: string): string | null {
    const match = url.match(/(?:discord\.gg\/|discord\.com\/invite\/)([a-zA-Z0-9]+)/)
    return match ? match[1] : null
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
