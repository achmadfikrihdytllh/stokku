import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import StockMovement from '#models/stock_movement'
import Stock from '#models/stock'
import {
  createStockMovementValidator,
  createTransferValidator,
} from '#validators/stock_movement'

export default class StockMovementsController {
  /**
   * Lihat histori transaksi (dengan filter opsional)
   */
  async index({ request, response }: HttpContext) {
    const { productId, warehouseId, type } = request.qs()

    const query = StockMovement.query()
      .preload('product')
      .preload('warehouse')
      .preload('user')
      .orderBy('created_at', 'desc')

    if (productId) query.where('product_id', productId)
    if (warehouseId) query.where('warehouse_id', warehouseId)
    if (type) query.where('type', type)

    const movements = await query
    return response.ok(movements)
  }

  /**
   * Stok masuk atau keluar
   */
  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createStockMovementValidator)

    const result = await db.transaction(async (trx) => {
      // Cari atau buat baris stok untuk kombinasi produk+gudang ini
      let stock = await Stock.query({ client: trx })
        .where('product_id', data.productId)
        .where('warehouse_id', data.warehouseId)
        .first()

      if (!stock) {
        stock = new Stock()
        stock.productId = data.productId
        stock.warehouseId = data.warehouseId
        stock.quantity = 0
        stock.useTransaction(trx)
      } else {
        stock.useTransaction(trx)
      }

      if (data.type === 'out' && stock.quantity < data.quantity) {
        throw new Error('Stok tidak mencukupi untuk transaksi ini')
      }

      // Update angka stok
      stock.quantity += data.type === 'in' ? data.quantity : -data.quantity
      await stock.save()

      // Catat histori transaksi
      const movement = await StockMovement.create(
        {
          productId: data.productId,
          warehouseId: data.warehouseId,
          type: data.type,
          quantity: data.quantity,
          referenceNote: data.referenceNote ?? null,
          userId: auth.user?.id ?? null,
        },
        { client: trx }
      )

      return movement
    })

    return response.created(result)
  }

  /**
   * Transfer stok antar gudang
   */
  async transfer({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createTransferValidator)

    if (data.fromWarehouseId === data.toWarehouseId) {
      return response.badRequest({ message: 'Gudang asal dan tujuan tidak boleh sama' })
    }

    const result = await db.transaction(async (trx) => {
      // Kurangi stok di gudang asal
      const fromStock = await Stock.query({ client: trx })
        .where('product_id', data.productId)
        .where('warehouse_id', data.fromWarehouseId)
        .first()

      if (!fromStock || fromStock.quantity < data.quantity) {
        throw new Error('Stok tidak mencukupi di gudang asal')
      }

      fromStock.useTransaction(trx)
      fromStock.quantity -= data.quantity
      await fromStock.save()

      // Tambah stok di gudang tujuan
      let toStock = await Stock.query({ client: trx })
        .where('product_id', data.productId)
        .where('warehouse_id', data.toWarehouseId)
        .first()

      if (!toStock) {
        toStock = new Stock()
        toStock.productId = data.productId
        toStock.warehouseId = data.toWarehouseId
        toStock.quantity = 0
      }
      toStock.useTransaction(trx)
      toStock.quantity += data.quantity
      await toStock.save()

      // Catat 2 histori: keluar dari asal, masuk ke tujuan
      const movementOut = await StockMovement.create(
        {
          productId: data.productId,
          warehouseId: data.fromWarehouseId,
          type: 'transfer_out',
          quantity: data.quantity,
          referenceNote: data.referenceNote ?? null,
          userId: auth.user?.id ?? null,
        },
        { client: trx }
      )

      await StockMovement.create(
        {
          productId: data.productId,
          warehouseId: data.toWarehouseId,
          type: 'transfer_in',
          quantity: data.quantity,
          referenceNote: data.referenceNote ?? null,
          userId: auth.user?.id ?? null,
        },
        { client: trx }
      )

      return movementOut
    })

    return response.created(result)
  }
}