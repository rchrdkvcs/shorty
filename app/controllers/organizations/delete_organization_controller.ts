import type { HttpContext } from '@adonisjs/core/http'
import Organization from '#models/organization'

export default class DeleteOrganizationController {
  async execute({ response, auth, params }: HttpContext) {
    const user = await auth.authenticate()

    const organizationId = params.id
    const organization = await Organization.query()
      .where('id', organizationId)
      .whereHas('users', (userQuery) => {
        userQuery.where('user_id', user.id)
      })
      .firstOrFail()

    try {
      await organization.delete()

      return response.redirect().back()
    } catch (error) {
      return response.status(400).send({
        message: "Erreur lors de la suppression de l'organisation",
        error: error.message,
      })
    }
  }
}
