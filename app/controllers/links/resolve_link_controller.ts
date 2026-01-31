import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import LinkRedirectService from '#services/link_redirect_service'
import MobileRedirectService from '#services/mobile_redirect_service'
import AnalyticsService from '#services/analytics_service'
import Link from '#models/link'
import Domain from '#models/domain'

@inject()
export default class ResolveLinkController {
  constructor(protected analyticsService: AnalyticsService) {}

  async execute({ params, request, response }: HttpContext) {
    const host = request.hostname()
    const slug = params.slug

    const domain = await Domain.findBy('label', host)

    const linkQuery = Link.query().where((query) => {
      query.where('slug_custom', slug).orWhere('slug_auto', slug)
    })

    if (domain) {
      linkQuery.andWhere('domain_id', domain.id)
    }

    const link = await linkQuery.first()

    if (!link) {
      return response.status(404).send('Lien introuvable')
    }

    // Record analytics
    const userAgent = request.header('user-agent') || ''
    const referrer = request.header('referer') || null
    const ipAddress = request.ip()
    
    // Track the click asynchronously
    this.analyticsService
      .recordClick({
        linkId: link.id,
        referrer,
        userAgent,
        ipAddress,
        device: MobileRedirectService.detectDevice(userAgent),
      })
      .catch((error) => {
        console.error('Failed to record analytics:', error)
      })

    const targetUrl = LinkRedirectService.getTargetUrl(link)
    const device = MobileRedirectService.detectDevice(userAgent)

    // For mobile devices, use smart redirect with deep links
    if (device !== 'desktop') {
      const config = {
        iosAppId: process.env.IOS_APP_ID,
        androidPackage: process.env.ANDROID_PACKAGE,
        fallbackUrl: targetUrl,
        deepLinkScheme: process.env.DEEP_LINK_SCHEME,
        universalLinkDomain: process.env.UNIVERSAL_LINK_DOMAIN,
      }

      const urls = MobileRedirectService.generateMobileUrl(targetUrl, config)
      const deviceUrl = device === 'ios' ? urls.ios : urls.android

      // If we have a deep link for this device, use smart redirect
      if (deviceUrl !== targetUrl) {
        return this.renderSmartRedirect(response, deviceUrl, targetUrl, device)
      }
    }

    // Default redirect for desktop or when no deep link is available
    return response.redirect().toPath(targetUrl)
  }

  private renderSmartRedirect(
    response: any,
    deepLinkUrl: string,
    fallbackUrl: string,
    device: string
  ) {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirection...</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        .spinner {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .fallback-link {
            display: inline-block;
            margin-top: 2rem;
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        .fallback-link:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <h2>Redirection en cours...</h2>
        <p>Ouverture de l'application...</p>
        <a href="${fallbackUrl}" class="fallback-link" id="fallback-link" style="display: none;">
            Ouvrir dans le navigateur
        </a>
    </div>

    <script>
        const deepLinkUrl = "${deepLinkUrl}";
        const fallbackUrl = "${fallbackUrl}";
        const device = "${device}";
        
        function attemptDeepLink() {
            let redirected = false;
            
            // Create a hidden iframe to trigger the deep link
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = deepLinkUrl;
            document.body.appendChild(iframe);
            
            // For iOS, also try direct window.location for better compatibility
            if (device === 'ios') {
                window.location.href = deepLinkUrl;
            }
            
            // Show fallback link after short delay
            setTimeout(() => {
                const fallbackLink = document.getElementById('fallback-link');
                if (fallbackLink) {
                    fallbackLink.style.display = 'inline-block';
                }
            }, 1000);
            
            // Auto-redirect to fallback if app doesn't open
            setTimeout(() => {
                if (!redirected) {
                    window.location.href = fallbackUrl;
                }
            }, 3000);
            
            // Detect if user comes back to page (app didn't open)
            let hidden = false;
            
            const onVisibilityChange = () => {
                if (document.hidden) {
                    hidden = true;
                } else if (hidden) {
                    // User came back, app probably didn't open
                    setTimeout(() => {
                        if (!redirected) {
                            window.location.href = fallbackUrl;
                        }
                    }, 100);
                }
            };
            
            document.addEventListener('visibilitychange', onVisibilityChange);
            
            // Also try to detect app opening through focus events
            const onBlur = () => {
                redirected = true;
                window.removeEventListener('blur', onBlur);
            };
            
            window.addEventListener('blur', onBlur);
            
            // Cleanup iframe after attempt
            setTimeout(() => {
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            }, 2000);
        }
        
        // Start the deep link attempt
        attemptDeepLink();
    </script>
</body>
</html>`

    return response.type('text/html').send(html)
  }
}
