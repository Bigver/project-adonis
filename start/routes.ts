import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/dashboard', 'PagesController.Dashboard').as('admin.dashboard')
    Route.get('/homeAdmin', 'PagesController.homeAdmin').as('admin.home')
    Route.get('/aboutAdmin', 'PagesController.aboutAdmin').as('admin.about')
    Route.get('/interestingAdmin', 'PagesController.interestingAdmin').as('admin.interesting')
    Route.get('/newsAdmin', 'PagesController.newsAdmin').as('admin.news')
    Route.get('/contactAdmin', 'PagesController.contactAdmin').as('admin.contact')
    Route.get('/productAdmin', 'PagesController.productAdmin').as('admin.product')
}).prefix('admin').middleware('auth')



Route.get('/', 'PagesController.homePage').middleware('auth')




Route.get('/register', 'PagesController.registerPage').as('page.register')
Route.post('/register', 'UsersController.register').as('user.register')
Route.get('/login', 'PagesController.loginPage').as('page.login')
Route.post('/login', 'UsersController.login').as('user.login')
Route.get('/logout', 'UsersController.logout').as('user.logout')
