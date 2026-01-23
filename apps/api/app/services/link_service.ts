import Link from '#models/link'
import Domain from '#models/domain'
import { randomBytes } from 'node:crypto'

interface CreateLinkPayload {
  userId: string
  targetUrl: string
  slugCustom?: string | null
  label?: string | null
  category?: string | null
  domainId?: string | null
}

interface UpdateLinkPayload {
  targetUrl?: string
  slugCustom?: string | null
  label?: string | null
  category?: string | null
  domainId?: string | null
}

export default class LinkService {
  public async index(userId: string) {
    return Link.query()
      .where('userId', userId)
      .preload('domain')
      .orderBy('createdAt', 'desc')
  }

  public async show(id: string, userId: string) {
    return Link.query()
      .where('id', id)
      .where('userId', userId)
      .preload('domain')
      .firstOrFail()
  }

  public async store(payload: CreateLinkPayload) {
    if (payload.domainId) {
      await this.validateDomainOwnership(payload.domainId, payload.userId)
    }

    const slugAuto = randomBytes(6).toString('base64url')
    const link = await Link.create({
      ...payload,
      slugAuto,
    })

    await link.load('domain')
    return link
  }

  public async update(id: string, userId: string, payload: UpdateLinkPayload) {
    const link = await this.show(id, userId)

    if (payload.domainId !== undefined && payload.domainId !== null) {
      await this.validateDomainOwnership(payload.domainId, userId)
    }

    link.merge(payload)
    await link.save()
    await link.load('domain')
    return link
  }

  public async destroy(id: string, userId: string) {
    const link = await this.show(id, userId)
    await link.delete()
    return { message: 'Link deleted successfully' }
  }

  public async findBySlug(slug: string) {
    return Link.query()
      .where('slugAuto', slug)
      .orWhere('slugCustom', slug)
      .preload('domain')
      .firstOrFail()
  }

  public async findBySlugAndDomain(slug: string, domainName: string) {
    const domain = await Domain.query().where('domain', domainName).where('isVerified', true).first()

    if (!domain) {
      throw new Error('Domain not found or not verified')
    }

    return Link.query()
      .where('domainId', domain.id)
      .where((query) => {
        query.where('slugAuto', slug).orWhere('slugCustom', slug)
      })
      .preload('domain')
      .firstOrFail()
  }

  private async validateDomainOwnership(domainId: string, userId: string) {
    const domain = await Domain.query()
      .where('id', domainId)
      .where('userId', userId)
      .where('isVerified', true)
      .first()

    if (!domain) {
      throw new Error('Domain not found, not verified, or does not belong to you')
    }

    return domain
  }
}
