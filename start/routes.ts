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
import { controllers } from '#generated/controllers'

router.get('/login', [controllers.auth.AuthLogins, 'render'])
router.post('/login', [controllers.auth.AuthLogins, 'execute'])

router.get('/register', [controllers.auth.AuthRegisters, 'render'])
router.post('/register', [controllers.auth.AuthRegisters, 'execute'])

router.get('/', ({ response }) => {
  return response.redirect('/dashboard')
})

router
  .group(() => {
    router.get('/dashboard', [controllers.dashboard.IndexDashboard, 'handle'])
    router.get('/dashboard/links', [controllers.links.IndexLink, 'render'])
    router.get('/dashboard/organizations', [controllers.organizations.IndexOrganization, 'render'])
    router.get('/dashboard/domains', [controllers.domains.IndexDomain, 'index'])
    router.get('/dashboard/domains/:id', [controllers.domains.ShowDomain, 'show'])
    router.get('/dashboard/analytics', [controllers.analytics.IndexAnalytics, 'handle'])

    router.post('/links', [controllers.links.StoreLink, 'execute'])
    router.patch('/links/:id', [controllers.links.UpdateLink, 'execute'])

    router.post('/domains', [controllers.domains.StoreDomain, 'store'])
    router.patch('/domains/:id', [controllers.domains.UpdateDomain, 'update'])
    router.delete('/domains/:id', [controllers.domains.DeleteDomain, 'delete'])

    router.post('/organizations', [controllers.organizations.StoreOrganization, 'execute'])
    router.patch('/organizations/:id', [controllers.organizations.UpdateOrganization, 'execute'])
    router.delete('/organizations/:id', [controllers.organizations.DeleteOrganization, 'execute'])
  })
  .use(middleware.auth())

router.get('/:slug', [controllers.links.ResolveLink, 'execute']).as('links.resolve')
