import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { ulid } from 'ulid'
import Link from '#models/link'
import Organization from '#models/organization'

export default class Domain extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(user: Domain) {
    user.id = ulid()
  }

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare label: string

  @column()
  declare isActive: boolean

  @column()
  declare organizationId: string

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @hasMany(() => Link)
  declare links: HasMany<typeof Link>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
