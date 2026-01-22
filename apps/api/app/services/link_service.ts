import Link from '#models/link'
import { randomBytes } from 'node:crypto'

interface CreateLinkPayload {
  userId: string
  targetUrl: string
  slugCustom?: string | null
  label?: string | null
  category?: string | null
}

interface UpdateLinkPayload {
  targetUrl?: string
  slugCustom?: string | null
  label?: string | null
  category?: string | null
}

export default class LinkService {
  public async index(userId: string) {
    return Link.query().where('userId', userId).orderBy('createdAt', 'desc')
  }

  public async show(id: string, userId: string) {
    return Link.query().where('id', id).where('userId', userId).firstOrFail()
  }

  public async store(payload: CreateLinkPayload) {
    const slugAuto = randomBytes(6).toString('base64url')
    return Link.create({
      ...payload,
      slugAuto,
    })
  }

  public async update(id: string, userId: string, payload: UpdateLinkPayload) {
    const link = await this.show(id, userId)
    link.merge(payload)
    await link.save()
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
      .firstOrFail()
  }
}
