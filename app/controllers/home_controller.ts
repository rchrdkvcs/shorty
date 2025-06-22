import type { HttpContext } from '@adonisjs/core/http'
import Link from '#models/link'

export default class HomeController {
  async render({ inertia }: HttpContext) {
    const links = await Link.query().preload('domain')

    return inertia.render('home', { links })
  }
}
