import { inject } from '@adonisjs/core'
import Link from '#models/link'
import string from '@adonisjs/core/helpers/string'
import SlugGeneratorService from '#services/slug_generator_service'
import DomainService from '#services/domain_service'

@inject()
export default class LinkManagementService {
  constructor(
    private slugGenerator: SlugGeneratorService,
    private domainService: DomainService
  ) {}

  async checkSlugUniqueness(
    slug: string,
    domainId: string | null,
    excludeId?: string
  ): Promise<boolean> {
    const query = Link.query().where('slug_custom', slug)

    if (excludeId) {
      query.where('id', '!=', excludeId)
    }

    if (domainId) {
      query.where('domain_id', domainId)
    } else {
      query.whereNull('domain_id')
    }

    const existingLink = await query.first()
    return !existingLink
  }

  async generateUniqueSlug(length: number = 8): Promise<string> {
    let slug: string
    let isUnique: boolean

    do {
      slug = this.slugGenerator.generate(length, { lowercase: true })
      isUnique = await this.checkSlugUniqueness(slug, null)
    } while (!isUnique)

    return slug
  }

  async validateAndPrepareSlug(
    customSlug: string | undefined,
    domainId: string | null,
    excludeId?: string
  ): Promise<{ slugCustom: string | null; isValid: boolean }> {
    if (!customSlug) {
      return { slugCustom: null, isValid: true }
    }

    const normalizedSlug = string.slug(customSlug)
    const isUnique = await this.checkSlugUniqueness(normalizedSlug, domainId, excludeId)

    return {
      slugCustom: normalizedSlug,
      isValid: isUnique,
    }
  }

  async buildShortUrl(link: Link): Promise<string> {
    const domain = link.domain || (await this.domainService.getDefaultDomain())
    const slug = link.slugCustom || link.slugAuto
    return this.domainService.buildFullUrl(domain, slug)
  }

  async createLink(data: {
    userId: any
    targetUrl: any
    slugCustom: string | null
    name: any
    category: any
    tags: any
    domainId: string | null
    organizationId: any
  }): Promise<Link> {
    const slugAuto = await this.generateUniqueSlug()

    return await Link.create({
      ...data,
      slugAuto,
      slugCustom: data.slugCustom ? string.slug(data.slugCustom) : null,
    })
  }

  async updateLink(
    link: Link,
    data: {
      slugCustom: string | null
      targetUrl: any
      name: any
      category: any
      tags: any
      domainId: string | null
      organizationId?: any
    }
  ): Promise<Link> {
    const updateData = { ...data }

    if (data.slugCustom !== undefined) {
      updateData.slugCustom = data.slugCustom ? string.slug(data.slugCustom) : null
    }

    link.merge(updateData)
    await link.save()

    return link
  }
}
