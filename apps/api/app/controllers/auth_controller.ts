import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AuthService from '#services/auth_service'
import User from '#models/user'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}

  public async redirect({ ally, params }: HttpContext) {
    const provider = ally.use(params.provider)
    return provider.redirect()
  }

  public async callback({ ally, params, auth, response }: HttpContext) {
    const provider = ally.use(params.provider)

    if (provider.accessDenied()) {
      return 'You have cancelled the login process'
    }

    if (provider.stateMisMatch()) {
      return 'We are unable to verify the request. Please try again'
    }

    if (provider.hasError()) {
      return provider.getError()
    }

    const providerUser = await provider.user()

    const user = await User.firstOrCreate(
      { email: providerUser.email },
      {
        email: providerUser.email,
        nickname: providerUser.nickName,
        avatarUrl: providerUser.avatarUrl,
        fullName: providerUser.name,
        provider: params.provider,
      }
    )

    await auth.use().login(user)

    return response.redirect('http://localhost:3000')
  }

  public async me({ auth }: HttpContext) {
    await auth.check()
    return auth.user ?? null
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use().logout()
    return response.ok({ message: 'Logged out' })
  }
}
