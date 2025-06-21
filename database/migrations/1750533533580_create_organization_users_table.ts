import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organization_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE')
      table.string('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.enum('role', ['owner', 'admin', 'member']).defaultTo('member')
      table.primary(['organization_id', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
