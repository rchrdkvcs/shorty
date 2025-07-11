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

const HomeController = () => import('#controllers/home_controller')
const LinksController = () => import('#controllers/links_controller')
const DomainsController = () => import('#controllers/domains_controller')
const AuthRegistersController = () => import('#controllers/auth_registers_controller')
const AuthLoginsController = () => import('#controllers/auth_logins_controller')

router.get('/login', [AuthLoginsController, 'render'])
router.post('/login', [AuthLoginsController, 'execute'])

router.get('/register', [AuthRegistersController, 'render'])
router.post('/register', [AuthRegistersController, 'execute'])

router
  .group(() => {
    router.get('/', [HomeController, 'render'])

    router.post('/links', [LinksController, 'store'])
    router.patch('/links/:id', [LinksController, 'update'])

    router.post('/domains', [DomainsController, 'store'])
  })
  .use(middleware.auth())

router.get('/:slug', [LinksController, 'resolve'])
