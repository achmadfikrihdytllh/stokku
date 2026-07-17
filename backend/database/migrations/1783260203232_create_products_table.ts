import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('sku').notNullable().unique()
      table.string('name').notNullable()
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')
        .nullable()
      table.string('unit').notNullable().defaultTo('pcs')
      table.decimal('buy_price', 15, 2).notNullable().defaultTo(0)
      table.decimal('sell_price', 15, 2).notNullable().defaultTo(0)
      table.string('photo').nullable()
      table.integer('min_stock').unsigned().notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}