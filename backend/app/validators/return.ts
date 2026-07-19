import vine from '@vinejs/vine'

export const createReturnValidator = vine.compile(
  vine.object({
    type: vine.enum(['customer', 'supplier'] as const),
    productId: vine.number(),
    warehouseId: vine.number(),
    quantity: vine.number().positive(),
    condition: vine.enum(['good', 'damaged', 'defective'] as const),
    reason: vine.string().trim().optional(),
  })
)