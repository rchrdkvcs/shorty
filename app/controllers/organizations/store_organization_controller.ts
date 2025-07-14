import type { HttpContext } from '@adonisjs/core/http'
import Organization from '#models/organization'
import OrganizationValidator from '#validators/organization_validator'

export default class StoreOrganizationController {
  async execute({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(OrganizationValidator.validator)

    try {
      const organization = await Organization.create({
        name: data.name,
        description: data.description,
        logoUrl: data.logoUrl,
      })

      await organization.related('users').attach([user.id])

      return response.redirect().back()
    } catch (error) {
      return response.status(400).send({
        message: "Erreur lors de la création de l'organisation",
        error: error.message,
      })
    }
  }
}
