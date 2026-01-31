import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'analytics'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('link_id').notNullable().references('id').inTable('links').onDelete('CASCADE')
      table.string('referrer').nullable()
      table.string('user_agent').nullable()
      table.string('ip_address').nullable()
      table.string('country').nullable()
      table.string('city').nullable()
      table.string('device').nullable()
      table.string('browser').nullable()
      table.string('os').nullable()

      table.timestamp('created_at')

      table.index(['link_id'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
