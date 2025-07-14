import type { HttpContext } from '@adonisjs/core/http'
import Organization from '#models/organization'
import OrganizationValidator from '#validators/organization_validator'

export default class UpdateOrganizationController {
  async execute({ request, response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(OrganizationValidator.validator)

    const organizationId = params.id
    const organization = await Organization.query()
      .where('id', organizationId)
      .whereHas('users', (userQuery) => {
        userQuery.where('user_id', user.id)
      })
      .firstOrFail()

    try {
      organization.merge({
        name: data.name,
        description: data.description,
        logoUrl: data.logoUrl,
      })

      await organization.save()

      return response.redirect().back()
    } catch (error) {
      return response.status(400).send({
        message: "Erreur lors de la modification de l'organisation",
        error: error.message,
      })
    }
  }
}
