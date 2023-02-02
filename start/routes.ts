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

// 로그인/아웃
Route.post('/login', 'UsersController.postLoginAction')

// User 시작
Route.group(()=> {
  Route.get('/', 'UsersController.cgetAction')
  Route.post('/', 'UsersController.postAction')
  Route.get('/:id', 'UsersController.getAction')
  Route.put('/:id', 'UsersController.putAction')
}).prefix('/users')

