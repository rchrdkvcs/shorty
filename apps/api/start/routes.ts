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
