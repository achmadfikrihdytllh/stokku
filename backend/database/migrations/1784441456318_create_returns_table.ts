import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'returns'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('type').notNullable() // 'customer' | 'supplier'
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
      table.integer('quantity').notNullable()
      table.string('condition').notNullable() // 'good' | 'damaged' | 'defective'
      table.string('reason').nullable()
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