import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stock_movements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('warehouse_id')
        .unsigned()
        .references('id')
        .inTable('warehouses')
        .onDelete('CASCADE')
        .notNullable()
      table.string('type').notNullable() // 'in' | 'out' | 'transfer_in' | 'transfer_out'
      table.integer('quantity').notNullable()
      table.string('reference_note').nullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}