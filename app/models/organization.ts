import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Domain from '#models/domain'
import User from '#models/user'
import Link from '#models/link'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(organization: Organization) {
    organization.id = ulid()
  }

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare logoUrl: string | null

  @hasMany(() => Domain)
  declare domains: HasMany<typeof Domain>

  @hasMany(() => Link)
  declare links: HasMany<typeof Link>

  @manyToMany(() => User, {
    pivotTable: 'organization_users',
    localKey: 'id',
    pivotForeignKey: 'organization_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
