import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Domain from '#models/domain'
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
  declare slugAuto: string

  @column()
  declare slugCustom: string | null

  @column()
  declare name: string | null

  @column()
  declare category: string | null

  @column()
  declare tags: string[] | null

  @column()
  declare targetUrl: string

  @column()
  declare iosUrl?: string

  @column()
  declare androidUrl?: string

  @column()
  declare fallbackUrl?: string

  get shortUrl(): string {
    const domain = this.domain?.name || env.get('APP_DOMAIN')
    const slug = this.slugCustom || this.slugAuto
    return `https://${domain}/${slug}`
  }
}
