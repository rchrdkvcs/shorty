import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import User from '#models/user'
import Domain from '#models/domain'
import QrCode from '#models/qr_code'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Link extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare domainId: string | null

  @belongsTo(() => Domain)
  declare domain: BelongsTo<typeof Domain>

  @column()
  declare targetUrl: string

  @column()
  declare slugAuto: string

  @column()
  declare slugCustom: string | null

  @column()
  declare label: string | null

  @column()
  declare category: string | null

  @hasMany(() => QrCode)
  declare qrCodes: HasMany<typeof QrCode>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static generateUuid(link: Link) {
    link.id = ulid()
  }
}
