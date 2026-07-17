import type { HttpContext } from '@adonisjs/core/http'
import Warehouse from '#models/warehouse'
import { createWarehouseValidator, updateWarehouseValidator } from '#validators/warehouse'

export default class WarehousesController {
  async index({ response }: HttpContext) {
    const warehouses = await Warehouse.query().orderBy('name', 'asc')
    return response.ok(warehouses)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createWarehouseValidator)
    const warehouse = await Warehouse.create(data)
    return response.created(warehouse)
  }

  async show({ params, response }: HttpContext) {
    const warehouse = await Warehouse.findOrFail(params.id)
    return response.ok(warehouse)
  }

  async update({ params, request, response }: HttpContext) {
    const warehouse = await Warehouse.findOrFail(params.id)
    const data = await request.validateUsing(updateWarehouseValidator)
    warehouse.merge(data)
    await warehouse.save()
    return response.ok(warehouse)
  }

  async destroy({ params, response }: HttpContext) {
    const warehouse = await Warehouse.findOrFail(params.id)
    await warehouse.delete()
    return response.noContent()
  }
}