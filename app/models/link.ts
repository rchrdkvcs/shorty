import { LinkSchema } from '#database/schema'
import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Domain from '#models/domain'
import Organization from '#models/organization'

export default class Link extends LinkSchema {
  @beforeCreate()
  static generateId(link: Link) {
    link.id = ulid()
  }

  @belongsTo(() => Domain)
  declare domain: BelongsTo<typeof Domain>

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>
}
