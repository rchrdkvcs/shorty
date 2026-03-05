import { DomainSchema } from '#database/schema'
import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Organization from '#models/organization'
import Link from '#models/link'

export default class Domain extends DomainSchema {
  @beforeCreate()
  static generateId(domain: Domain) {
    domain.id = ulid()
  }

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @hasMany(() => Link)
  declare links: HasMany<typeof Link>
}
