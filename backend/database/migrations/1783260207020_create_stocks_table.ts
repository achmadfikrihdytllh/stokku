import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stocks'

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
      table.integer('quantity').notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Satu produk cuma boleh punya 1 baris stok per gudang
      table.unique(['product_id', 'warehouse_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}