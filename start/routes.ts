/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

// 공통
Route.post('/login', 'UsersController.postLoginAction')
Route.post('/tel-auth', 'UsersController.postTelAuthenticationAction')
Route.get('/tel-auth-confirm', 'UsersController.getTelAuthenticationConfirmAction')
Route.get('/email-double-check', 'UsersController.getEmailDoubleCheckAction')
Route.post('/change-password', 'UsersController.postChangePasswordAction')

// User 시작
Route.group(()=> {
  Route.get('/myInfo', 'UsersController.getAction').middleware('auth')
  Route.post('/', 'UsersController.postAction')
  Route.get('/:id', 'UsersController.getAction')
  Route.put('/:id', 'UsersController.putAction')
}).prefix('/users')

