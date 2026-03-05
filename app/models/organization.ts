import { OrganizationSchema } from '#database/schema'
import { beforeCreate, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Domain from '#models/domain'
import Link from '#models/link'
import User from '#models/user'

export default class Organization extends OrganizationSchema {
  @beforeCreate()
  static generateId(organization: Organization) {
    organization.id = ulid()
  }

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
}
