import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AnalyticsMigration extends BaseSchema {
  protected tableName = 'analytics'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('link_id').notNullable().references('id').inTable('links').onDelete('CASCADE')
      table.string('referrer')
      table.string('user_agent')
      table.string('ip_address')
      table.string('country')
      table.string('city')
      table.string('device')
      table.string('browser')
      table.string('os')

      table.timestamp('created_at')

      table.index(['link_id'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
