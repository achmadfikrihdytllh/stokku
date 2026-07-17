import type { HttpContext } from '@adonisjs/core/http'
import Stock from '#models/stock'

export default class StocksController {
  /**
   * Lihat semua stok (dengan filter opsional per gudang)
   */
  async index({ request, response }: HttpContext) {
    const { warehouseId, lowStock } = request.qs()

    const query = Stock.query().preload('product').preload('warehouse')

    if (warehouseId) query.where('warehouse_id', warehouseId)

    let stocks = await query

    // Filter stok menipis (dibanding minStock produk)
    if (lowStock === 'true') {
      stocks = stocks.filter((stock) => stock.quantity <= (stock.product?.minStock ?? 0))
    }

    return response.ok(stocks)
  }
}