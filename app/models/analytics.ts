import { AnalyticsSchema } from '#database/schema'
import { beforeCreate } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'

export default class Analytics extends AnalyticsSchema {
  @beforeCreate()
  static generateId(analytics: Analytics) {
    analytics.id = ulid()
  }
}
