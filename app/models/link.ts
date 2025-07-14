import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Domain from '#models/domain'
import Organization from '#models/organization'
import env from '#start/env'

export default class Link extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(link: Link) {
    link.id = ulid()
  }

  @column()
  declare userId: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare domainId: string | null

  @belongsTo(() => Domain)
  declare domain: BelongsTo<typeof Domain>

  @column()
  declare organizationId: string

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @column()
  declare slugAuto: string

  @column()
  declare slugCustom: string | null

  @column()
  declare name: string | null

  @column()
  declare category: string | null

  @column({
    serialize: (value: string[]) => value,
    prepare: (value: string[] | string) => {
      if (typeof value === 'string') {
        return JSON.stringify(
          value
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      }
      return JSON.stringify(value || [])
    },
    consume: (value: string) => {
      if (!value) return []
      try {
        return JSON.parse(value)
      } catch {
        return []
      }
    },
  })
  declare tags: string[]

  @column()
  declare targetUrl: string

  get shortUrl(): string {
    const domain = this.domain?.label || env.get('APP_DOMAIN')
    const slug = this.slugCustom || this.slugAuto
    return `https://${domain}/${slug}`
  }

  get effectiveSlug(): string {
    return this.slugCustom || this.slugAuto
  }

  get hasCustomSlug(): boolean {
    return Boolean(this.slugCustom)
  }

  get displayName(): string {
    return this.name || this.targetUrl || 'Lien sans nom'
  }

  get displayCategory(): string {
    return this.category || 'Aucune'
  }
}
