import type { HttpContext } from '@adonisjs/core/http'
import LinkRedirectService from '#services/link_redirect_service'
import Link from '#models/link'
import Domain from '#models/domain'

export default class ResolveLinkController {
  async execute({ params, request, response }: HttpContext) {
    const host = request.hostname()
    const slug = params.slug

    const domain = await Domain.findBy('label', host)

    const linkQuery = Link.query().where((query) => {
      query.where('slug_custom', slug).orWhere('slug_auto', slug)
    })

    if (domain) {
      linkQuery.andWhere('domain_id', domain.id)
    }

    const link = await linkQuery.first()

    if (!link) {
      return response.status(404).send('Lien introuvable')
    }

    const targetUrl = LinkRedirectService.getTargetUrl(link)

    return response.redirect().toPath(targetUrl)
  }
}
