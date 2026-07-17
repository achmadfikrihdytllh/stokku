import vine from '@vinejs/vine'

export const createStockMovementValidator = vine.compile(
  vine.object({
    productId: vine.number(),
    warehouseId: vine.number(),
    type: vine.enum(['in', 'out'] as const),
    quantity: vine.number().positive(),
    referenceNote: vine.string().trim().optional(),
  })
)

export const createTransferValidator = vine.compile(
  vine.object({
    productId: vine.number(),
    fromWarehouseId: vine.number(),
    toWarehouseId: vine.number(),
    quantity: vine.number().positive(),
    referenceNote: vine.string().trim().optional(),
  })
)