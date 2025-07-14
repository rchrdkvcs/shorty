import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Link from '#models/link'
import LinkManagementService from '#services/link_management_service'
import DomainService from '#services/domain_service'
import LinkValidator from '#validators/link_validator'
import { LINK_MESSAGES } from '../../constants/messages.js'

@inject()
export default class UpdateLinkController {
  constructor(
    private linkManagement: LinkManagementService,
    private domainService: DomainService
  ) {}

  async execute({ request, response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(LinkValidator.validator)

    const linkId = params.id
    const link = await Link.findOrFail(linkId)

    if (link.userId !== user.id) {
      return response.status(403).send(LINK_MESSAGES.UNAUTHORIZED)
    }

    const domainId = await this.domainService.getDomainId(request.hostname())

    const { slugCustom, isValid } = await this.linkManagement.validateAndPrepareSlug(
      data.slugCustom,
      domainId,
      linkId
    )

    if (!isValid) {
      return response.status(400).send(LINK_MESSAGES.SLUG_EXISTS)
    }

    try {
      await this.linkManagement.updateLink(link, {
        slugCustom,
        targetUrl: data.targetUrl,
        name: data.name,
        category: data.category,
        tags: data.tags,
        domainId,
        organizationId: data.organizationId,
      })

      return response.redirect().back()
    } catch (error) {
      return response.status(400).send(LINK_MESSAGES.UPDATE_FAILED)
    }
  }
}
