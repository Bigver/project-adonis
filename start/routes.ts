import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/dashboard', 'PagesController.Dashboard').as('admin.dashboard')
    Route.get('/homeAdmin', 'PagesController.homeAdmin').as('admin.home')
    Route.get('/aboutAdmin', 'PagesController.aboutAdmin').as('admin.about')
    Route.get('/interestingAdmin', 'PagesController.interestingAdmin').as('admin.interesting')
    Route.get('/newsAdmin', 'PagesController.newsAdmin').as('admin.news')
    Route.get('/contactAdmin', 'PagesController.contactAdmin').as('admin.contact')
    Route.get('/productAdmin', 'PagesController.productAdmin').as('admin.product')
    Route.get('/productListAdmin', 'PagesController.productListAdmin').as('admin.productList')
    Route.get('/userAdmin', 'PagesController.userAdmin').as('admin.user')


    
    //about
    Route.post('/about/create', 'AboutsController.create').as('about.create')
     

    //user
    Route.get('/user/:id/edit','PagesController.userUpdateAdmin').as('user.edit')
    Route.get('/user/delete/:id', 'UsersController.destroy').as('user.remove')
    Route.post('/user/update/:id', 'UsersController.update').as('user.update')


    Route.get('/showInteresting', 'PagesController.showInteresting').as('showInteresting')
    Route.get('/UpdateinterestingPage', 'PagesController.UpdateinterestingPage').as('UpdateinterestingPage')
    Route.post('/addInteresting', 'InterestingsController.add').as('add.Interesting')
    Route.post('/UpdateInteresting/:id', 'InterestingsController.UpdateInteresting').as('UpdateInteresting')

    Route.get('/Interestingedit/:id', 'InterestingsController.editInteresting').as('Interesting.edit')
    Route.get('/Interesting/delete/:id', 'InterestingsController.deleteInteresting').as('Interesting.remove')

    Route.get('/Interestingstatus/:id', 'InterestingsController.toggleStatus').as('Interestings.status') // Change News Status


}).prefix('admin').middleware('auth').middleware('authCheck')



Route.get('/', 'PagesController.homePage').middleware('auth')




Route.get('/register', 'PagesController.registerPage').as('page.register')
Route.post('/register', 'UsersController.register').as('user.register')
Route.get('/login', 'PagesController.loginPage').as('page.login')
Route.post('/login', 'UsersController.login').as('user.login')
Route.get('/logout', 'UsersController.logout').as('user.logout')

