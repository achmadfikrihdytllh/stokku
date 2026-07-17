import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Product from '#models/product'
import Warehouse from '#models/warehouse'
import Stock from '#models/stock'

export default class DashboardController {
  async summary({ response }: HttpContext) {
    const totalProducts = await Product.query().count('* as total')
    const totalWarehouses = await Warehouse.query().count('* as total')

    const stocks = await Stock.query().preload('product')
    const totalInventoryValue = stocks.reduce((sum, stock) => {
      return sum + stock.quantity * Number(stock.product.buyPrice)
    }, 0)

    const lowStockCount = stocks.filter(
      (stock) => stock.quantity <= stock.product.minStock
    ).length

    return response.ok({
      totalProducts: Number(totalProducts[0].$extras.total),
      totalWarehouses: Number(totalWarehouses[0].$extras.total),
      totalInventoryValue,
      lowStockCount,
    })
  }

  /**
   * Tren transaksi stok masuk/keluar per hari, 7 hari terakhir
   */
  async movementTrend({ response }: HttpContext) {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const movements = await db
      .from('stock_movements')
      .select(
        db.raw("TO_CHAR(created_at, 'YYYY-MM-DD') as date"),
        'type',
        db.raw('SUM(quantity) as total')
      )
      .where('created_at', '>=', sevenDaysAgo.toISOString())
      .groupByRaw("TO_CHAR(created_at, 'YYYY-MM-DD'), type")
      .orderBy('date', 'asc')

    // Susun ulang jadi format per tanggal: { date, in, out }
    const grouped: Record<string, { date: string; in: number; out: number }> = {}

    for (const row of movements) {
      if (!grouped[row.date]) {
        grouped[row.date] = { date: row.date, in: 0, out: 0 }
      }
      if (row.type === 'in') grouped[row.date].in += Number(row.total)
      if (row.type === 'out') grouped[row.date].out += Number(row.total)
    }

    return response.ok(Object.values(grouped))
  }

  /**
   * Top 5 produk dengan stok terbanyak
   */
  async topProducts({ response }: HttpContext) {
    const stocks = await Stock.query()
      .preload('product')
      .orderBy('quantity', 'desc')
      .limit(5)

    const result = stocks.map((s) => ({
      name: s.product.name,
      quantity: s.quantity,
    }))

    return response.ok(result)
  }
}