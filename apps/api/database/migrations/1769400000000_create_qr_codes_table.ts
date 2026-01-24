import { BaseSchema } from '@adonisjs/lucid/schema'

export default class QrCodesMigration extends BaseSchema {
  protected tableName = 'qr_codes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('link_id').notNullable().references('id').inTable('links').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('foreground_color').notNullable().defaultTo('#000000')
      table.string('background_color').notNullable().defaultTo('#ffffff')
      table.string('logo_url').nullable()
      table.integer('size').notNullable().defaultTo(300)
      table.enum('error_correction_level', ['L', 'M', 'Q', 'H']).notNullable().defaultTo('M')
      table.integer('logo_size').nullable()
      table.boolean('rounded_corners').notNullable().defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index('user_id')
      table.index('link_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
