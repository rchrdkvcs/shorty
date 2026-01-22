/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

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
