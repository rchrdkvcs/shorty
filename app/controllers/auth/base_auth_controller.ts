import type { HttpContext } from '@adonisjs/core/http'
import { AUTH_MESSAGES } from '../../constants/messages.js'

export default class BaseAuthController {
  protected handleAuthSuccess({ response }: HttpContext) {
    return response.redirect('/')
  }

  protected handleAuthError({ session, response }: HttpContext, message: string) {
    session.flashErrors({ form: message })
    return response.redirect().back()
  }

  protected handleLoginError(ctx: HttpContext) {
    return this.handleAuthError(ctx, AUTH_MESSAGES.INVALID_CREDENTIALS)
  }

  protected handleRegistrationError(ctx: HttpContext) {
    return this.handleAuthError(ctx, AUTH_MESSAGES.REGISTRATION_FAILED)
  }

  protected async authenticateUser({ auth }: HttpContext, user: any) {
    await auth.use('web').login(user)
  }
}
