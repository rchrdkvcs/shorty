import type { HttpContext } from '@adonisjs/core/http'
import Link from '#models/link'
import string from '@adonisjs/core/helpers/string'
import Domain from '#models/domain'
import { inject } from '@adonisjs/core'
import SlugGeneratorService from '#services/slug_generator_service'
import LinkValidator from '#validators/link_validator'

@inject()
export default class StoreLinkController {
  constructor(private slugGenerator: SlugGeneratorService) {}

  async execute({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(LinkValidator.validator)

    const slugAuto = this.slugGenerator.generate(8, { lowercase: true })
    const host = request.hostname()

    const domain = await Domain.findBy('label', host)
    const domainId = domain?.id ?? null

    const existingLink = await Link.query()
      .where((query) => {
        query.where('slug_auto', slugAuto)

        if (data.slugCustom) {
          query.orWhere((subQuery) => {
            subQuery.where('slug_custom', string.slug(data.slugCustom!))
            if (domainId) {
              subQuery.andWhere('domain_id', domainId)
            } else {
              subQuery.andWhereNull('domain_id')
            }
          })
        }
      })
      .first()

    if (existingLink) {
      return response.status(400).send('Un lien avec ce slug existe déjà dans ce domaine.')
    }

    await Link.create({
      userId: user.id,
      slugAuto,
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

    return response.redirect().back()
  }
}
