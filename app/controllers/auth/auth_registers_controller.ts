import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Organization from '#models/organization'
import BaseAuthController from '#controllers/auth/base_auth_controller'

export default class AuthRegistersController extends BaseAuthController {
  render({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async execute(ctx: HttpContext) {
    const { request } = ctx
    const { username, email, password } = request.body()

    try {
      const user = await User.create({
        username,
        email,
        password,
      })

      // Créer une organisation "Personal" par défaut
      const personalOrganization = await Organization.create({
        name: 'Personal',
        description: 'Organisation personnelle',
      })

      // Associer l'utilisateur à l'organisation
      await user.related('organizations').attach([personalOrganization.id])

      await this.authenticateUser(ctx, user)
      return this.handleAuthSuccess(ctx)
    } catch (error) {
      return this.handleRegistrationError(ctx)
    }
  }
}
