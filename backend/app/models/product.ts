import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'
import Stock from '#models/stock'
import StockMovement from '#models/stock_movement'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sku: string

  @column()
  declare name: string

  @column()
  declare categoryId: number | null

  @column()
  declare unit: string

  @column()
  declare buyPrice: number

  @column()
  declare sellPrice: number

  @column()
  declare photo: string | null

  @column()
  declare minStock: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => Stock)
  declare stocks: HasMany<typeof Stock>

  @hasMany(() => StockMovement)
  declare stockMovements: HasMany<typeof StockMovement>
}