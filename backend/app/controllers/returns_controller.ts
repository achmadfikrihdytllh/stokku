import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import ReturnModel from '#models/return'
import Stock from '#models/stock'
import StockMovement from '#models/stock_movement'
import { createReturnValidator } from '#validators/return'

export default class ReturnsController {
  async index({ request, response }: HttpContext) {
    const { type, warehouseId, productId } = request.qs()

    const query = ReturnModel.query()
      .preload('product')
      .preload('warehouse')
      .preload('user')
      .orderBy('created_at', 'desc')

    if (type) query.where('type', type)
    if (warehouseId) query.where('warehouse_id', warehouseId)
    if (productId) query.where('product_id', productId)

    const returns = await query
    return response.ok(returns)
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createReturnValidator)

    const result = await db.transaction(async (trx) => {
      // ===== RETUR KE SUPPLIER: barang keluar dari gudang kita =====
      if (data.type === 'supplier') {
        const stock = await Stock.query({ client: trx })
          .where('product_id', data.productId)
          .where('warehouse_id', data.warehouseId)
          .first()

        if (!stock || stock.quantity < data.quantity) {
          throw new Error('Stok tidak mencukupi untuk retur ke supplier')
        }

        stock.useTransaction(trx)
        stock.quantity -= data.quantity
        await stock.save()

        await StockMovement.create(
          {
            productId: data.productId,
            warehouseId: data.warehouseId,
            type: 'return_out',
            quantity: data.quantity,
            referenceNote: `Retur ke supplier (${data.condition})${data.reason ? ': ' + data.reason : ''}`,
            userId: auth.user?.id ?? null,
          },
          { client: trx }
        )
      }

      // ===== RETUR DARI CUSTOMER: barang masuk lagi ke gudang kita =====
      if (data.type === 'customer') {
        // Hanya kondisi "baik" yang menambah stok bisa-dijual.
        // Barang rusak/cacat tetap dicatat sebagai histori,
        // tapi TIDAK menambah stok yang bisa dijual.
        if (data.condition === 'good') {
          let stock = await Stock.query({ client: trx })
            .where('product_id', data.productId)
            .where('warehouse_id', data.warehouseId)
            .first()

          if (!stock) {
            stock = new Stock()
            stock.productId = data.productId
            stock.warehouseId = data.warehouseId
            stock.quantity = 0
          }
          stock.useTransaction(trx)
          stock.quantity += data.quantity
          await stock.save()
        }

        await StockMovement.create(
          {
            productId: data.productId,
            warehouseId: data.warehouseId,
            type: data.condition === 'good' ? 'return_in' : 'return_in_damaged',
            quantity: data.quantity,
            referenceNote: `Retur dari customer (${data.condition})${data.reason ? ': ' + data.reason : ''}`,
            userId: auth.user?.id ?? null,
          },
          { client: trx }
        )
      }

      const returnRecord = await ReturnModel.create(
        {
          type: data.type,
          productId: data.productId,
          warehouseId: data.warehouseId,
          quantity: data.quantity,
          condition: data.condition,
          reason: data.reason ?? null,
          userId: auth.user?.id ?? null,
        },
        { client: trx }
      )

      return returnRecord
    })

    return response.created(result)
  }
}