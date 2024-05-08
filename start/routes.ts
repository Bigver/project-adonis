import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/dashboard', 'PagesController.Dashboard').as('admin.dashboard')
    Route.get('/homeAdmin', 'PagesController.homeAdmin').as('admin.home')
    Route.get('/aboutAdmin', 'PagesController.aboutAdmin').as('admin.about')
    Route.get('/interestingAdmin', 'PagesController.interestingAdmin').as('admin.interesting')
    Route.get('/newsAdmin', 'PagesController.newsAdmin').as('admin.news') //เพชร Admin AddNews Page
    Route.get('/contactAdmin', 'PagesController.contactAdmin').as('admin.contact')
    Route.get('/productAdmin', 'PagesController.productAdmin').as('admin.product')
    Route.get('/productListAdmin', 'PagesController.productListAdmin').as('admin.productList')
    Route.get('/userAdmin', 'PagesController.userAdmin').as('admin.user')
    Route.get('/profile', 'PagesController.profilePage').as('page.profile')
    Route.post('/user/update/profile/:id', 'UsersController.updateProfile').as('user.update.profile')

    //home
    Route.post('/homeAdmin/update', 'HomeController.update').as('admin.home.update')

    //about
    Route.post('/about/create', 'AboutsController.create').as('about.create')
    //contact
    Route.post('/contacts', 'ContactsController.create').as('contacts.create')

    //user
    Route.get('/user/:id/edit','PagesController.userUpdateAdmin').as('user.edit')
    Route.get('/user/delete/:id', 'UsersController.destroy').as('user.remove')
    Route.post('/user/update/:id', 'UsersController.update').as('user.update')
    // Route.get('/user/search', 'PagesController.userAdmin').as('searchuser')   //product


    //interesting
    Route.get('/showInteresting', 'PagesController.showInteresting').as('showInteresting')
    Route.get('/UpdateinterestingPage', 'PagesController.UpdateinterestingPage').as('UpdateinterestingPage')
    Route.post('/addInteresting', 'InterestingsController.add').as('add.Interesting')
    Route.post('/UpdateInteresting/:id', 'InterestingsController.UpdateInteresting').as('UpdateInteresting')
    Route.get('/Interestingedit/:id', 'InterestingsController.editInteresting').as('Interesting.edit')
    Route.get('/Interesting/delete/:id', 'InterestingsController.deleteInteresting').as('Interesting.remove')
    Route.get('/Interestingstatus/:id', 'InterestingsController.toggleStatus').as('Interestings.status') // Change News Status


    Route.post('/news/add', 'NewsController.add').as('news.add') // เพชร addNews Functions
    Route.get('/news', 'PagesController.newsPage').as('news.page') // User News Page
    Route.get('/newscontent/:id', 'PagesController.newsContent').as('news.content') // User NewsContent
    Route.post('/newsupdate/:id', 'NewsController.update').as('news.update')// News Admin Update
    Route.get('/newsupdating/:id', 'PagesController.newsUpdatePage').as('news.update.page')
    Route.get('/news/update', 'PagesController.newsUpdateList').as('news.update.list') //Admin  List News Page
    Route.get('/news/status/:id', 'NewsController.toggleStatus').as('news.status') // Change News Status Functions
    Route.get('/news/delete/:id', 'NewsController.delete').as('news.delete') // Admin News Delete
    Route.post('/news/search', 'PagesController.newsUpdateList').as('searchnew')   //product


    //product
    Route.post('/product/create', 'ProductsController.createProduct').as('product.create')
    Route.post('/product/update/:id', 'ProductsController.updateProduct').as('update.product')
    Route.post('/products/search', 'ProductsController.listProduct').as('search')   //product

    Route.get('/product/delete/:id', 'ProductsController.deleteProduct').as('product.remove')
    Route.get('/productedit/:id', 'ProductsController.editProduct').as('product.edit')
    Route.get('/productlist', 'ProductsController.listProduct').as('product.list')

}).prefix('admin').middleware('auth').middleware('authCheck')



Route.get('/error', 'PagesController.errorPage').as('page.error')
Route.get('/', 'PagesController.homePage').middleware('auth')

// Route.get('/search', async ({ request , response }) => {
//     const searchTerm = request.input('term');
//     try {
//         const searchData = await User.query().where('username', 'like', `%${searchTerm}%`)
//         .orWhere('id', 'like', `%${searchTerm}%`)
//         .orWhere('email', 'like', `%${searchTerm}%`)
//         .select('*');
//         return response.json(searchData);
//       } catch (error) {
//         return response.status(500).json({ error: 'An error occurred while searching data' });
//       }
//   }).as('search')


Route.get('/register', 'PagesController.registerPage').as('page.register')
Route.post('/register', 'UsersController.register').as('user.register')
Route.get('/login', 'PagesController.loginPage').as('page.login')
Route.post('/login', 'UsersController.login').as('user.login')
Route.get('/logout', 'UsersController.logout').as('user.logout')

