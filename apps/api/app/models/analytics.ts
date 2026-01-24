import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import Link from '#models/link'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Analytics extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare linkId: string

  @belongsTo(() => Link)
  declare link: BelongsTo<typeof Link>

  @column()
  declare referrer: string | null

  @column()
  declare userAgent: string | null

  @column()
  declare ipAddress: string | null

  @column()
  declare country: string | null

  @column()
  declare city: string | null

  @column()
  declare device: string | null

  @column()
  declare browser: string | null

  @column()
  declare os: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeCreate()
  static generateUuid(analytics: Analytics) {
    analytics.id = ulid()
  }
}
