import type { HttpContext } from '@adonisjs/core/http'
import { AUTH_MESSAGES } from '../../constants/messages.js'

export default class BaseAuthController {
  protected handleAuthSuccess({ response }: HttpContext) {
    return response.redirect('/')
  }

  protected handleAuthError({ response }: HttpContext, message: string, statusCode: number = 400) {
    return response.status(statusCode).send({ error: message })
  }

  protected handleLoginError(ctx: HttpContext) {
    return this.handleAuthError(ctx, AUTH_MESSAGES.INVALID_CREDENTIALS, 401)
  }

  protected handleRegistrationError(ctx: HttpContext) {
    return this.handleAuthError(ctx, AUTH_MESSAGES.REGISTRATION_FAILED, 400)
  }

  protected async authenticateUser({ auth }: HttpContext, user: any) {
    await auth.use('web').login(user)
  }
}
