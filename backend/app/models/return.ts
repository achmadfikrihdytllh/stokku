import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from '#models/product'
import Warehouse from '#models/warehouse'
import User from '#models/user'

export default class Return extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: 'customer' | 'supplier'

  @column()
  declare productId: number

  @column()
  declare warehouseId: number

  @column()
  declare quantity: number

  @column()
  declare condition: 'good' | 'damaged' | 'defective'

  @column()
  declare reason: string | null

  @column()
  declare userId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => Warehouse)
  declare warehouse: BelongsTo<typeof Warehouse>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}