import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    sku: vine.string().trim().minLength(2).maxLength(50),
    name: vine.string().trim().minLength(2).maxLength(150),
    categoryId: vine.number().optional(),
    unit: vine.string().trim().maxLength(20).optional(),
    buyPrice: vine.number().min(0),
    sellPrice: vine.number().min(0),
    minStock: vine.number().min(0).optional(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    sku: vine.string().trim().minLength(2).maxLength(50).optional(),
    name: vine.string().trim().minLength(2).maxLength(150).optional(),
    categoryId: vine.number().optional(),
    unit: vine.string().trim().maxLength(20).optional(),
    buyPrice: vine.number().min(0).optional(),
    sellPrice: vine.number().min(0).optional(),
    minStock: vine.number().min(0).optional(),
  })
)