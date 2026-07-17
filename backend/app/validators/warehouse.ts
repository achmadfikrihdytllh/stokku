import vine from '@vinejs/vine'

export const createWarehouseValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    address: vine.string().trim().optional(),
  })
)

export const updateWarehouseValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    address: vine.string().trim().optional(),
  })
)