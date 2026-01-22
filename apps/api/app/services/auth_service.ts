import { inject } from '@adonisjs/core'
import User from '#models/user'

@inject()
export default class AuthService {
  public async register(payload: any) {
    return await User.updateOrCreate({ email: payload.email }, payload)
  }

  public async login(payload: any) {
    const user = await User.findBy('email', payload.email)

    if (!user) {
      return null
    }

    return user
  }
}
