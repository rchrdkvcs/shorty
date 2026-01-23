import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import User from '#models/user'
import Link from '#models/link'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Domain extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare domain: string

  @column()
  declare isVerified: boolean

  @column()
  declare verificationToken: string

  @hasMany(() => Link)
  declare links: HasMany<typeof Link>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static generateUuid(domain: Domain) {
    domain.id = ulid()
  }
}
