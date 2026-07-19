/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'warehouses.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/warehouses',
    tokens: [{"old":"/api/v1/warehouses","type":0,"val":"api","end":""},{"old":"/api/v1/warehouses","type":0,"val":"v1","end":""},{"old":"/api/v1/warehouses","type":0,"val":"warehouses","end":""}],
    types: placeholder as Registry['warehouses.index']['types'],
  },
  'warehouses.store': {
    methods: ["POST"],
    pattern: '/api/v1/warehouses',
    tokens: [{"old":"/api/v1/warehouses","type":0,"val":"api","end":""},{"old":"/api/v1/warehouses","type":0,"val":"v1","end":""},{"old":"/api/v1/warehouses","type":0,"val":"warehouses","end":""}],
    types: placeholder as Registry['warehouses.store']['types'],
  },
  'warehouses.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/warehouses/:id',
    tokens: [{"old":"/api/v1/warehouses/:id","type":0,"val":"api","end":""},{"old":"/api/v1/warehouses/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/warehouses/:id","type":0,"val":"warehouses","end":""},{"old":"/api/v1/warehouses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['warehouses.show']['types'],
  },
  'warehouses.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/warehouses/:id',
    tokens: [{"old":"/api/v1/warehouses/:id","type":0,"val":"api","end":""},{"old":"/api/v1/warehouses/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/warehouses/:id","type":0,"val":"warehouses","end":""},{"old":"/api/v1/warehouses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['warehouses.update']['types'],
  },
  'warehouses.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/warehouses/:id',
    tokens: [{"old":"/api/v1/warehouses/:id","type":0,"val":"api","end":""},{"old":"/api/v1/warehouses/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/warehouses/:id","type":0,"val":"warehouses","end":""},{"old":"/api/v1/warehouses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['warehouses.destroy']['types'],
  },
  'categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/categories',
    tokens: [{"old":"/api/v1/categories","type":0,"val":"api","end":""},{"old":"/api/v1/categories","type":0,"val":"v1","end":""},{"old":"/api/v1/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.index']['types'],
  },
  'categories.store': {
    methods: ["POST"],
    pattern: '/api/v1/categories',
    tokens: [{"old":"/api/v1/categories","type":0,"val":"api","end":""},{"old":"/api/v1/categories","type":0,"val":"v1","end":""},{"old":"/api/v1/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.store']['types'],
  },
  'categories.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.show']['types'],
  },
  'categories.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.update']['types'],
  },
  'categories.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.destroy']['types'],
  },
  'products.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/products',
    tokens: [{"old":"/api/v1/products","type":0,"val":"api","end":""},{"old":"/api/v1/products","type":0,"val":"v1","end":""},{"old":"/api/v1/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.index']['types'],
  },
  'products.store': {
    methods: ["POST"],
    pattern: '/api/v1/products',
    tokens: [{"old":"/api/v1/products","type":0,"val":"api","end":""},{"old":"/api/v1/products","type":0,"val":"v1","end":""},{"old":"/api/v1/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.store']['types'],
  },
  'products.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/products/:id',
    tokens: [{"old":"/api/v1/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.show']['types'],
  },
  'products.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/products/:id',
    tokens: [{"old":"/api/v1/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.update']['types'],
  },
  'products.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/products/:id',
    tokens: [{"old":"/api/v1/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.destroy']['types'],
  },
  'stocks.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/stocks',
    tokens: [{"old":"/api/v1/stocks","type":0,"val":"api","end":""},{"old":"/api/v1/stocks","type":0,"val":"v1","end":""},{"old":"/api/v1/stocks","type":0,"val":"stocks","end":""}],
    types: placeholder as Registry['stocks.index']['types'],
  },
  'stock_movements.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/stock-movements',
    tokens: [{"old":"/api/v1/stock-movements","type":0,"val":"api","end":""},{"old":"/api/v1/stock-movements","type":0,"val":"v1","end":""},{"old":"/api/v1/stock-movements","type":0,"val":"stock-movements","end":""}],
    types: placeholder as Registry['stock_movements.index']['types'],
  },
  'stock_movements.store': {
    methods: ["POST"],
    pattern: '/api/v1/stock-movements',
    tokens: [{"old":"/api/v1/stock-movements","type":0,"val":"api","end":""},{"old":"/api/v1/stock-movements","type":0,"val":"v1","end":""},{"old":"/api/v1/stock-movements","type":0,"val":"stock-movements","end":""}],
    types: placeholder as Registry['stock_movements.store']['types'],
  },
  'stock_movements.transfer': {
    methods: ["POST"],
    pattern: '/api/v1/stock-movements/transfer',
    tokens: [{"old":"/api/v1/stock-movements/transfer","type":0,"val":"api","end":""},{"old":"/api/v1/stock-movements/transfer","type":0,"val":"v1","end":""},{"old":"/api/v1/stock-movements/transfer","type":0,"val":"stock-movements","end":""},{"old":"/api/v1/stock-movements/transfer","type":0,"val":"transfer","end":""}],
    types: placeholder as Registry['stock_movements.transfer']['types'],
  },
  'dashboard.summary': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/dashboard/summary',
    tokens: [{"old":"/api/v1/dashboard/summary","type":0,"val":"api","end":""},{"old":"/api/v1/dashboard/summary","type":0,"val":"v1","end":""},{"old":"/api/v1/dashboard/summary","type":0,"val":"dashboard","end":""},{"old":"/api/v1/dashboard/summary","type":0,"val":"summary","end":""}],
    types: placeholder as Registry['dashboard.summary']['types'],
  },
  'dashboard.movement_trend': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/dashboard/movement-trend',
    tokens: [{"old":"/api/v1/dashboard/movement-trend","type":0,"val":"api","end":""},{"old":"/api/v1/dashboard/movement-trend","type":0,"val":"v1","end":""},{"old":"/api/v1/dashboard/movement-trend","type":0,"val":"dashboard","end":""},{"old":"/api/v1/dashboard/movement-trend","type":0,"val":"movement-trend","end":""}],
    types: placeholder as Registry['dashboard.movement_trend']['types'],
  },
  'dashboard.top_products': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/dashboard/top-products',
    tokens: [{"old":"/api/v1/dashboard/top-products","type":0,"val":"api","end":""},{"old":"/api/v1/dashboard/top-products","type":0,"val":"v1","end":""},{"old":"/api/v1/dashboard/top-products","type":0,"val":"dashboard","end":""},{"old":"/api/v1/dashboard/top-products","type":0,"val":"top-products","end":""}],
    types: placeholder as Registry['dashboard.top_products']['types'],
  },
  'returns.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/returns',
    tokens: [{"old":"/api/v1/returns","type":0,"val":"api","end":""},{"old":"/api/v1/returns","type":0,"val":"v1","end":""},{"old":"/api/v1/returns","type":0,"val":"returns","end":""}],
    types: placeholder as Registry['returns.index']['types'],
  },
  'returns.store': {
    methods: ["POST"],
    pattern: '/api/v1/returns',
    tokens: [{"old":"/api/v1/returns","type":0,"val":"api","end":""},{"old":"/api/v1/returns","type":0,"val":"v1","end":""},{"old":"/api/v1/returns","type":0,"val":"returns","end":""}],
    types: placeholder as Registry['returns.store']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
