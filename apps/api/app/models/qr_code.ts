import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import User from '#models/user'
import Link from '#models/link'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class QrCode extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare linkId: string

  @belongsTo(() => Link)
  declare link: BelongsTo<typeof Link>

  @column()
  declare name: string

  @column()
  declare foregroundColor: string

  @column()
  declare backgroundColor: string

  @column()
  declare logoUrl: string | null

  @column()
  declare size: number

  @column()
  declare errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'

  @column()
  declare logoSize: number | null

  @column()
  declare roundedCorners: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static generateUuid(qrCode: QrCode) {
    qrCode.id = ulid()
  }
}
