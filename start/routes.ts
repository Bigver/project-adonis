import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/dashboard', 'PagesController.Dashboard').as('admin.dashboard')
    Route.get('/homeAdmin', 'PagesController.homeAdmin').as('admin.home')
    Route.get('/aboutAdmin', 'PagesController.aboutAdmin').as('admin.about')
    Route.get('/interestingAdmin', 'PagesController.interestingAdmin').as('admin.interesting')
    Route.get('/newsAdmin', 'PagesController.newsAdmin').as('admin.news') //เพชร Admin AddNews Page
    Route.get('/contactAdmin', 'PagesController.contactAdmin').as('admin.contact')
    Route.get('/productAdmin', 'PagesController.productAdmin').as('admin.product')
    Route.post('/news/add', 'NewsController.add').as('news.add') // เพชร addNews Functions
    Route.get('/news', 'PagesController.newsPage').as('news.page') // User News Page
    Route.get('/newscontent/:id', 'PagesController.newsContent').as('news.content') // User NewsContent
    Route.post('/newsupdate/:id', 'NewsController.update').as('news.update')// News Admin Update
    Route.get('/newsupdating/:id', 'PagesController.newsUpdatePage').as('news.update.page')
    Route.get('/news/update/', 'PagesController.newsUpdateList').as('news.update.list') //Admin  List News Page
    Route.get('/news/status/:id', 'NewsController.toggleStatus').as('news.status') // Change News Status Functions
    Route.get('/news/delete/:id', 'NewsController.delete').as('news.delete') // Admin News Delete

}).prefix('admin').middleware('auth').middleware('authcheck')



Route.get('/', 'PagesController.homePage').middleware('auth')




Route.get('/register', 'PagesController.registerPage').as('page.register')
Route.post('/register', 'UsersController.register').as('user.register')
Route.get('/login', 'PagesController.loginPage').as('page.login')
Route.post('/login', 'UsersController.login').as('user.login')
Route.get('/logout', 'UsersController.logout').as('user.logout')
