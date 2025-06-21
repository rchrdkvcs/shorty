import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'domains'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 26).primary()
      table.string('name', 255).notNullable()
      table.string('description', 255).nullable()
      table.string('label', 255).notNullable().unique()
      table.boolean('is_active').defaultTo(true)

      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
