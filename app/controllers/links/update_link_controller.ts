import type { HttpContext } from '@adonisjs/core/http'
import Link from '#models/link'
import string from '@adonisjs/core/helpers/string'
import Domain from '#models/domain'
import LinkValidator from '#validators/link_validator'

export default class UpdateLinkController {
  async execute({ request, response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(LinkValidator.validator)

    const linkId = params.id
    const link = await Link.findOrFail(linkId)

    if (link.userId !== user.id) {
      return response.status(403).send("Vous n'êtes pas autorisé à modifier ce lien.")
    }

    const host = request.hostname()
    const domain = await Domain.findBy('label', host)
    const domainId = domain?.id ?? null

    if (data.slugCustom) {
      const existingLink = await Link.query()
        .where('slug_custom', string.slug(data.slugCustom))
        .where('id', '!=', linkId)
        .where((query) => {
          if (domainId) {
            query.where('domain_id', domainId)
          } else {
            query.whereNull('domain_id')
          }
        })
        .first()

      if (existingLink) {
        return response.status(400).send('Un lien avec ce slug existe déjà dans ce domaine.')
      }
    }

    link.merge({
      slugCustom: data.slugCustom ? string.slug(data.slugCustom) : null,
      targetUrl: data.targetUrl,
      iosUrl: data.iosUrl,
      androidUrl: data.androidUrl,
      fallbackUrl: data.fallbackUrl,
      name: data.name,
      category: data.category,
      tags: data.tags,
      domainId,
    })

    await link.save()

    return response.redirect().back()
  }
}
