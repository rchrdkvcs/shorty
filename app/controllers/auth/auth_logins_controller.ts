import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import BaseAuthController from '#controllers/auth/base_auth_controller'

export default class AuthLoginsController extends BaseAuthController {
  async render({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async execute(ctx: HttpContext) {
    const { request } = ctx
    const { email, password } = request.body()

    try {
      const user = await User.verifyCredentials(email, password)
      await this.authenticateUser(ctx, user)
      return this.handleAuthSuccess(ctx)
    } catch (error) {
      return this.handleLoginError(ctx)
    }
  }
}
