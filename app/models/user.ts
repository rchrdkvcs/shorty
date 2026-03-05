import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { beforeCreate, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { ulid } from 'ulid'
import Link from '#models/link'
import Organization from '#models/organization'
import { UserSchema } from '#database/schema'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(UserSchema, AuthFinder) {
  @beforeCreate()
  static generateId(user: User) {
    user.id = ulid()
  }

  @hasMany(() => Link)
  declare links: HasMany<typeof Link>

  @manyToMany(() => Organization, {
    pivotTable: 'organization_users',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'organization_id',
  })
  declare organizations: ManyToMany<typeof Organization>
}
