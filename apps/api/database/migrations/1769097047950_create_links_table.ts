import { BaseSchema } from '@adonisjs/lucid/schema'

export default class LinksMigration extends BaseSchema {
  protected tableName = 'links'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('target_url').notNullable()
      table.string('slug_auto').notNullable().unique()
      table.string('slug_custom').unique()
      table.string('label')
      table.string('category')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
