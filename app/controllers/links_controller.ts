import type { HttpContext } from '@adonisjs/core/http'
import LinkRedirectService from '#services/link_redirect_service'
import Link from '#models/link'
import vine from '@vinejs/vine'
import string from '@adonisjs/core/helpers/string'
import Domain from '#models/domain'
import { inject } from '@adonisjs/core'
import SlugGeneratorService from '#services/slug_generator_service'

@inject()
export default class LinksController {
  constructor(private slugGenerator: SlugGeneratorService) {}

  static validator = vine.compile(
    vine.object({
      slugCustom: vine.string().trim().minLength(3).maxLength(32).optional(),
      targetUrl: vine.string().trim().url(),
      iosUrl: vine.string().trim().url().optional(),
      androidUrl: vine.string().trim().url().optional(),
      fallbackUrl: vine.string().trim().url().optional(),
      name: vine.string().trim().maxLength(100).optional(),
      category: vine.string().trim().maxLength(50).optional(),
      tags: vine.array(vine.string().trim().maxLength(30)).optional(),
    })
  )

  async resolve({ params, request, response }: HttpContext) {
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

    const userAgent = request.header('user-agent') || ''
    const targetUrl = LinkRedirectService.getTargetUrl(link, userAgent)

    return response.redirect().toPath(targetUrl)
  }

  async store({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(LinksController.validator)

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

    return response.redirect('/')
  }
}
