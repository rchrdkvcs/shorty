/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const LinksController = () => import('#controllers/links_controller')
const AnalyticsController = () => import('#controllers/analytics_controller')
const DomainsController = () => import('#controllers/domains_controller')
const QrCodesController = () => import('#controllers/qr_codes_controller')

router
  .group(() => {
    router
      .group(() => {
        router.get('redirect', [AuthController, 'redirect'])
        router.get('callback', [AuthController, 'callback'])
      })
      .prefix(':provider')
      .where('provider', /discord|github|google|twitter/)

    router.get('me', [AuthController, 'me'])
    router.post('logout', [AuthController, 'logout'])
  })
  .prefix('auth')

router.resource('links', LinksController).apiOnly().use('*', middleware.auth())

// Domains routes (auth required)
router
  .group(() => {
    router.get('/', [DomainsController, 'index'])
    router.get('/verified', [DomainsController, 'verified'])
    router.post('/', [DomainsController, 'store'])
    router.get('/:id', [DomainsController, 'show'])
    router.patch('/:id', [DomainsController, 'update'])
    router.delete('/:id', [DomainsController, 'destroy'])
    router.post('/:id/verify', [DomainsController, 'verify'])
  })
  .prefix('domains')
  .use(middleware.auth())

// QR Codes routes (auth required)
router
  .group(() => {
    router.get('/', [QrCodesController, 'index'])
    router.post('/', [QrCodesController, 'store'])
    router.get('/:id', [QrCodesController, 'show'])
    router.patch('/:id', [QrCodesController, 'update'])
    router.delete('/:id', [QrCodesController, 'destroy'])
    router.get('/link/:linkId', [QrCodesController, 'getByLinkId'])
  })
  .prefix('qr-codes')
  .use(middleware.auth())

// Analytics routes (auth required)
router
  .group(() => {
    router.get('overview', [AnalyticsController, 'overview'])
    router.get('clicks-by-period', [AnalyticsController, 'clicksByPeriod'])
    router.get('top-links', [AnalyticsController, 'topLinks'])
    router.get('clicks-by-referrer', [AnalyticsController, 'clicksByReferrer'])
    router.get('clicks-by-country', [AnalyticsController, 'clicksByCountry'])
    router.get('clicks-by-device', [AnalyticsController, 'clicksByDevice'])
    router.get('clicks-by-browser', [AnalyticsController, 'clicksByBrowser'])
    router.get('links/:id', [AnalyticsController, 'linkAnalytics'])
  })
  .prefix('analytics')
  .use(middleware.auth())

// Public redirect lookup (no auth required)
router.get('r/:slug', [LinksController, 'findBySlug'])
