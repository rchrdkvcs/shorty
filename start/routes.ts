/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const StoreLinkController = () => import('#controllers/links/store_link_controller')
const IndexLinkController = () => import('#controllers/links/index_link_controller')
const UpdateLinkController = () => import('#controllers/links/update_link_controller')
const StoreDomainController = () => import('#controllers/domains/store_domain_controller')
const ResolveLinkController = () => import('#controllers/links/resolve_link_controller')
const AuthLoginsController = () => import('#controllers/auth/auth_logins_controller')
const AuthRegistersController = () => import('#controllers/auth/auth_registers_controller')

router.get('/login', [AuthLoginsController, 'render'])
router.post('/login', [AuthLoginsController, 'execute'])

router.get('/register', [AuthRegistersController, 'render'])
router.post('/register', [AuthRegistersController, 'execute'])

router.get('/', ({ response }) => {
  return response.redirect('/dashboard/links')
})

router
  .group(() => {
    router.get('/dashboard/links', [IndexLinkController, 'render'])

    router.post('/links', [StoreLinkController, 'execute'])
    router.patch('/links/:id', [UpdateLinkController, 'execute'])

    router.post('/domains', [StoreDomainController, 'store'])
  })
  .use(middleware.auth())

router.get('/:slug', [ResolveLinkController, 'execute'])
