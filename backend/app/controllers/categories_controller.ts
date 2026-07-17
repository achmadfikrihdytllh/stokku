import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { createCategoryValidator, updateCategoryValidator } from '#validators/category'

export default class CategoriesController {
  async index({ response }: HttpContext) {
    const categories = await Category.query().orderBy('name', 'asc')
    return response.ok(categories)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createCategoryValidator)
    const category = await Category.create(data)
    return response.created(category)
  }

  async show({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    return response.ok(category)
  }

  async update({ params, request, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const data = await request.validateUsing(updateCategoryValidator)
    category.merge(data)
    await category.save()
    return response.ok(category)
  }

  async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return response.noContent()
  }
}