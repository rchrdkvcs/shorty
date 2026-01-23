import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DomainsMigration extends BaseSchema {
  protected tableName = 'domains'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('domain').notNullable().unique()
      table.boolean('is_verified').notNullable().defaultTo(false)
      table.string('verification_token').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['user_id'])
      table.index(['domain'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
