import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
