import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddDomainIdToLinksMigration extends BaseSchema {
  protected tableName = 'links'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('domain_id')
        .references('id')
        .inTable('domains')
        .onDelete('SET NULL')
      table.index(['domain_id'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('domain_id')
    })
  }
}
