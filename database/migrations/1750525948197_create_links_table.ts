import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'links'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 26).primary()
      table.string('slug_auto').unique().notNullable()
      table.string('slug_custom').nullable()
      table.string('name').nullable()
      table.string('category').nullable()
      table.string('tags').nullable()
      table.string('target_url').notNullable()
      table.string('ios_url')
      table.string('android_url')
      table.string('fallback_url')

      table.string('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('domain_id').references('id').inTable('domains').onDelete('SET NULL').nullable()
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.unique(['slug_custom', 'domain_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
