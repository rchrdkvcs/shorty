import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import LinkManagementService from '#services/link_management_service'
import DomainService from '#services/domain_service'
import LinkValidator from '#validators/link_validator'
import { LINK_MESSAGES } from '../../constants/messages.js'

@inject()
export default class StoreLinkController {
  constructor(
    private linkManagement: LinkManagementService,
    private domainService: DomainService
  ) {}

  async execute({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(LinkValidator.validator)

    const domainId = await this.domainService.getDomainId(request.hostname())

    const { slugCustom, isValid } = await this.linkManagement.validateAndPrepareSlug(
      data.slugCustom,
      domainId
    )

    if (!isValid) {
      return response.status(400).send(LINK_MESSAGES.SLUG_EXISTS)
    }

    try {
      await this.linkManagement.createLink({
        userId: user.id,
        targetUrl: data.targetUrl,
        slugCustom,
        name: data.name,
        category: data.category,
        tags: data.tags,
        domainId,
        organizationId: data.organizationId,
      })

      return response.redirect().back()
    } catch (error) {
      return response.status(400).send(LINK_MESSAGES.CREATION_FAILED)
    }
  }
}
