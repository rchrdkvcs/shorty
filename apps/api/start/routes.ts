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

// Public redirect lookup (no auth required)
router.get('r/:slug', [LinksController, 'findBySlug'])
