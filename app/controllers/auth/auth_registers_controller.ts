import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthRegistersController {
  render({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async execute({ request, response, auth }: HttpContext) {
    const { username, email, password } = request.body()

    try {
      const user = await User.create({
        username,
        email,
        password,
      })

      // Automatically log in the user after registration
      await auth.use('web').login(user)

      return response.redirect('/')
    } catch (error) {
      return response.status(400).send({ error: 'Registration failed. Please try again.' })
    }
  }
}
