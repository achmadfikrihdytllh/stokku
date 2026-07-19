import type { HttpContext } from '@adonisjs/core/http'
import ExcelJS from 'exceljs'
import Product from '#models/product'
import Category from '#models/category'
import { createProductValidator, updateProductValidator } from '#validators/product'

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    const search = request.input('search')

    const query = Product.query().preload('category').orderBy('name', 'asc')

    if (search) {
      query.where((builder) => {
        builder.whereILike('name', `%${search}%`).orWhereILike('sku', `%${search}%`)
      })
    }

    const products = await query
    return response.ok(products)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createProductValidator)
    const product = await Product.create(data)
    return response.created(product)
  }

  async show({ params, response }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .preload('category')
      .preload('stocks', (q) => q.preload('warehouse'))
      .firstOrFail()
    return response.ok(product)
  }

  async update({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = await request.validateUsing(updateProductValidator)
    product.merge(data)
    await product.save()
    return response.ok(product)
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.noContent()
  }

  async export({ response }: HttpContext) {
    const products = await Product.query().preload('category').orderBy('name', 'asc')

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Produk')

    sheet.columns = [
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Nama Produk', key: 'name', width: 30 },
      { header: 'Kategori', key: 'category', width: 20 },
      { header: 'Satuan', key: 'unit', width: 10 },
      { header: 'Harga Beli', key: 'buyPrice', width: 15 },
      { header: 'Harga Jual', key: 'sellPrice', width: 15 },
      { header: 'Stok Minimum', key: 'minStock', width: 15 },
    ]

    sheet.getRow(1).font = { bold: true }

    for (const p of products) {
      sheet.addRow({
        sku: p.sku,
        name: p.name,
        category: p.category?.name ?? '',
        unit: p.unit,
        buyPrice: Number(p.buyPrice),
        sellPrice: Number(p.sellPrice),
        minStock: p.minStock,
      })
    }

    const buffer = await workbook.xlsx.writeBuffer()

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', 'attachment; filename="produk.xlsx"')
    return response.send(buffer)
  }

  /**
   * Download template kosong untuk keperluan import
   */
  async importTemplate({ response }: HttpContext) {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Produk')

    sheet.columns = [
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Nama Produk', key: 'name', width: 30 },
      { header: 'Kategori', key: 'category', width: 20 },
      { header: 'Satuan', key: 'unit', width: 10 },
      { header: 'Harga Beli', key: 'buyPrice', width: 15 },
      { header: 'Harga Jual', key: 'sellPrice', width: 15 },
      { header: 'Stok Minimum', key: 'minStock', width: 15 },
    ]
    sheet.getRow(1).font = { bold: true }

    sheet.addRow({
      sku: 'CONTOH-001',
      name: 'Nama Produk Contoh',
      category: 'Elektronik',
      unit: 'pcs',
      buyPrice: 10000,
      sellPrice: 15000,
      minStock: 5,
    })

    const buffer = await workbook.xlsx.writeBuffer()

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', 'attachment; filename="template-import-produk.xlsx"')
    return response.send(buffer)
  }

  async import({ request, response }: HttpContext) {
    const file = request.file('file', {
      extnames: ['xlsx', 'xls'],
      size: '5mb',
    })

    if (!file) {
      return response.badRequest({ message: 'File tidak ditemukan' })
    }

    if (!file.isValid) {
      return response.badRequest({ message: file.errors[0]?.message ?? 'File tidak valid' })
    }

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(file.tmpPath!)
    const sheet = workbook.worksheets[0]

    const results = {
      created: 0,
      updated: 0,
      errors: [] as { row: number; message: string }[],
    }

    const categories = await Category.all()
    const categoryMap = new Map(categories.map((c) => [c.name.toLowerCase(), c.id]))

    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber)

      const sku = row.getCell(1).text?.trim()
      const name = row.getCell(2).text?.trim()
      const categoryName = row.getCell(3).text?.trim()
      const unit = row.getCell(4).text?.trim() || 'pcs'
      const buyPrice = Number(row.getCell(5).value)
      const sellPrice = Number(row.getCell(6).value)
      const minStock = Number(row.getCell(7).value) || 0

      if (!sku && !name) continue

      if (!sku || !name) {
        results.errors.push({ row: rowNumber, message: 'SKU dan Nama Produk wajib diisi' })
        continue
      }

      if (Number.isNaN(buyPrice) || Number.isNaN(sellPrice)) {
        results.errors.push({ row: rowNumber, message: 'Harga beli/jual harus berupa angka' })
        continue
      }

      const categoryId = categoryName ? categoryMap.get(categoryName.toLowerCase()) : undefined

      try {
        const existing = await Product.findBy('sku', sku)

        if (existing) {
          existing.merge({ name, categoryId, unit, buyPrice, sellPrice, minStock })
          await existing.save()
          results.updated++
        } else {
          await Product.create({ sku, name, categoryId, unit, buyPrice, sellPrice, minStock })
          results.created++
        }
      } catch {
        results.errors.push({ row: rowNumber, message: 'Gagal menyimpan baris ini' })
      }
    }

    return response.ok(results)
  }
}