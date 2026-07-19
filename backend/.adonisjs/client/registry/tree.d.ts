/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  warehouses: {
    index: typeof routes['warehouses.index']
    store: typeof routes['warehouses.store']
    show: typeof routes['warehouses.show']
    update: typeof routes['warehouses.update']
    destroy: typeof routes['warehouses.destroy']
  }
  categories: {
    index: typeof routes['categories.index']
    store: typeof routes['categories.store']
    show: typeof routes['categories.show']
    update: typeof routes['categories.update']
    destroy: typeof routes['categories.destroy']
  }
  products: {
    index: typeof routes['products.index']
    store: typeof routes['products.store']
    show: typeof routes['products.show']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  stocks: {
    index: typeof routes['stocks.index']
  }
  stockMovements: {
    index: typeof routes['stock_movements.index']
    store: typeof routes['stock_movements.store']
    transfer: typeof routes['stock_movements.transfer']
  }
  dashboard: {
    summary: typeof routes['dashboard.summary']
    movementTrend: typeof routes['dashboard.movement_trend']
    topProducts: typeof routes['dashboard.top_products']
  }
  returns: {
    index: typeof routes['returns.index']
    store: typeof routes['returns.store']
  }
}
