import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'
import Product from '#models/product'
import Warehouse from '#models/warehouse'
import Stock from '#models/stock'

export default class extends BaseSeeder {
  async run() {
    const warehouse = await Warehouse.query().first()
    if (!warehouse) {
      console.log('⚠️  Jalankan user_seeder dulu (butuh warehouse)')
      return
    }

    const elektronik = await Category.create({ name: 'Elektronik' })
    const alatTulis = await Category.create({ name: 'Alat Tulis' })

    const products = await Product.createMany([
      {
        sku: 'ELK-001',
        name: 'Kabel HDMI 2M',
        categoryId: elektronik.id,
        unit: 'pcs',
        buyPrice: 15000,
        sellPrice: 25000,
        minStock: 10,
      },
      {
        sku: 'ELK-002',
        name: 'Mouse Wireless',
        categoryId: elektronik.id,
        unit: 'pcs',
        buyPrice: 45000,
        sellPrice: 75000,
        minStock: 5,
      },
      {
        sku: 'ATK-001',
        name: 'Pulpen Hitam',
        categoryId: alatTulis.id,
        unit: 'box',
        buyPrice: 20000,
        sellPrice: 30000,
        minStock: 20,
      },
    ])

    // Kasih stok awal buat tiap produk di gudang pusat
    for (const product of products) {
      await Stock.create({
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: Math.floor(Math.random() * 50) + 20, // 20-70
      })
    }

    console.log('✅ Categories, Products & Stocks seeded')
  }
}