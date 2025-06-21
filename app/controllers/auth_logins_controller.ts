import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthLoginsController {
  async render({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async execute({ request, response, auth }: HttpContext) {
    const { email, password } = request.body()

    try {
      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user)

      return response.redirect('/')
    } catch (error) {
      return response.status(401).send({ error: 'Invalid credentials. Please try again.' })
    }
  }
}
