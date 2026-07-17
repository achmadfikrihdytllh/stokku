/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

const WarehousesController = () => import('#controllers/warehouses_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const ProductsController = () => import('#controllers/products_controller')
const StocksController = () => import('#controllers/stocks_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const StockMovementsController = () => import('#controllers/stock_movements_controller')
router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
      
    router
      .group(() => {
        router.resource('warehouses', WarehousesController).apiOnly()
        router.resource('categories', CategoriesController).apiOnly()
        router.resource('products', ProductsController).apiOnly()
        router.get('stocks', [StocksController, 'index'])
        router.get('stock-movements', [StockMovementsController, 'index'])
        router.post('stock-movements', [StockMovementsController, 'store'])
        router.post('stock-movements/transfer', [StockMovementsController, 'transfer'])
        router.get('dashboard/summary', [DashboardController, 'summary'])
        router.get('dashboard/movement-trend', [DashboardController, 'movementTrend'])
        router.get('dashboard/top-products', [DashboardController, 'topProducts'])
      })
      .use(middleware.auth())
  })
  .prefix('/api/v1')




