import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fullName: string

  @column()
  declare avatarUrl: string

  @column()
  declare nickname: string

  @column()
  declare email: string

  @column()
  declare provider: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static generateUuid(user: User) {
    user.id = ulid()
  }
}
