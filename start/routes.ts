import Route from '@ioc:Adonis/Core/Route'

Route.post('/register', 'UserController.register')
Route.post('/deposit', 'UserController.deposit')
Route.post('/withdraw', 'UserController.withdraw')
