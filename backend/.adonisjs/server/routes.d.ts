import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'warehouses.index': { paramsTuple?: []; params?: {} }
    'warehouses.store': { paramsTuple?: []; params?: {} }
    'warehouses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'warehouses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'warehouses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'stocks.index': { paramsTuple?: []; params?: {} }
    'stock_movements.index': { paramsTuple?: []; params?: {} }
    'stock_movements.store': { paramsTuple?: []; params?: {} }
    'stock_movements.transfer': { paramsTuple?: []; params?: {} }
    'dashboard.summary': { paramsTuple?: []; params?: {} }
    'dashboard.movement_trend': { paramsTuple?: []; params?: {} }
    'dashboard.top_products': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'warehouses.index': { paramsTuple?: []; params?: {} }
    'warehouses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'stocks.index': { paramsTuple?: []; params?: {} }
    'stock_movements.index': { paramsTuple?: []; params?: {} }
    'dashboard.summary': { paramsTuple?: []; params?: {} }
    'dashboard.movement_trend': { paramsTuple?: []; params?: {} }
    'dashboard.top_products': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'warehouses.index': { paramsTuple?: []; params?: {} }
    'warehouses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'stocks.index': { paramsTuple?: []; params?: {} }
    'stock_movements.index': { paramsTuple?: []; params?: {} }
    'dashboard.summary': { paramsTuple?: []; params?: {} }
    'dashboard.movement_trend': { paramsTuple?: []; params?: {} }
    'dashboard.top_products': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'warehouses.store': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
    'stock_movements.store': { paramsTuple?: []; params?: {} }
    'stock_movements.transfer': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'warehouses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'warehouses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'warehouses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}