import Route from '@ioc:Adonis/Core/Route'

import "./member"

Route.group(() => {
    Route.get('/dashboard', 'PagesController.Dashboard').as('admin.dashboard')

    //home
    Route.get('/homeAdmin', 'HomeController.homeAdmin').as('admin.home')
    Route.post('/homeAdmin/update', 'HomeController.update').as('admin.home.update')

    //about
    Route.post('/about/create', 'AboutsController.create').as('about.create')
    Route.get('/aboutAdmin', 'AboutsController.aboutAdmin').as('admin.about')
    //contact
    Route.post('/contacts', 'ContactsController.create').as('contacts.create')
    Route.get('/contactAdmin', 'ContactsController.contactAdmin').as('admin.contact')

    //user
    Route.get('/user/:id/edit', 'UsersController.userUpdateAdmin').as('user.edit')
    Route.get('/user/delete/:id', 'UsersController.destroy').as('user.remove')
    Route.post('/user/update/:id', 'UsersController.update').as('user.update')
    Route.get('/userAdmin', 'UsersController.userAdmin').as('admin.user')
    Route.get('/profile', 'PagesController.profilePage').as('page.profile')
    Route.post('/user/update/profile/:id', 'UsersController.updateProfile').as('user.update.profile')


    //interesting
    Route.get('/interestingAdmin', 'InterestingsController.interestingAdmin').as('admin.interesting')
    Route.get('/showInteresting', 'InterestingsController.showInteresting').as('showInteresting')
    Route.get('/UpdateinterestingPage', 'InterestingsController.UpdateinterestingPage').as('UpdateinterestingPage')
    Route.post('/addInteresting', 'InterestingsController.add').as('add.Interesting')
    Route.post('/UpdateInteresting/:id', 'InterestingsController.UpdateInteresting').as('UpdateInteresting')
    Route.get('/Interestingedit/:id', 'InterestingsController.editInteresting').as('Interesting.edit')
    Route.get('/Interesting/delete/:id', 'InterestingsController.deleteInteresting').as('Interesting.remove')
    Route.get('/Interestingstatus/:id', 'InterestingsController.toggleStatus').as('Interestings.status') // Change News Status

    //news
    Route.post('/news/add', 'NewsController.addNews').as('news.add') // เพชร addNews Functions
    Route.get('/news', 'NewsController.newsPage').as('news.page') // User News Page
    Route.get('/newscontent/:id', 'NewsController.newsContent').as('news.content') // User NewsContent
    Route.post('/newsupdate/:id', 'NewsController.updateNews').as('news.update')// News Admin Update
    Route.get('/newsupdating/:id', 'NewsController.editNews').as('news.update.page')
    Route.get('/news/update', 'NewsController.newsUpdateList').as('news.update.list') //Admin  List News Page
    Route.get('/news/status/:id', 'NewsController.toggleStatus').as('news.status') // Change News Status Functions
    Route.get('/news/delete/:id', 'NewsController.delete').as('news.delete') // Admin News Delete
    Route.post('/news/search', 'NewsController.newsUpdateList').as('searchnew')   //product
    Route.get('/newsAdmin', 'NewsController.newsAdmin').as('admin.news') //เพชร Admin AddNews Page


    //product
    Route.get('/productAdmin', 'ProductsController.productAdmin').as('admin.product')
    Route.get('/productListAdmin', 'ProductsController.productListAdmin').as('admin.productList')
    Route.post('/product/create', 'ProductsController.createProduct').as('product.create')
    Route.post('/product/update/:id', 'ProductsController.updateProduct').as('product.update')
    Route.post('/products/search', 'ProductsController.listProduct').as('search')   //product
    Route.get('/product/delete/:id', 'ProductsController.deleteProduct').as('product.remove')
    Route.get('/productedit/:id', 'ProductsController.editProduct').as('product.edit')
    Route.get('/productlist', 'ProductsController.listProduct').as('product.list')

    //Cart
    Route.post('/cart/add', 'CartsController.addCart').as('add.cart')
    Route.get('/shopcart', 'CartsController.shopCart').as('shopcart.page')
    Route.post('/cartDecrease/:id', 'CartsController.decreaseProductQuantityInCart').as('decrease.cart')
    Route.post('/cartIncrease/:id', 'CartsController.increaseProductQuantityInCart').as('increase.cart')

    //Order
    Route.post('/cart/checkout', 'OrderController.checkOut').as('checkout')
    Route.get('/order/', 'OrderController.order').as('order.page')
    Route.get('/order/:id', 'OrderController.orderDetail').as('order.detail')
    Route.get('/orderChangeStatus/:id', 'OrderController.changeStatusOrder').as('order.change.status')
    Route.get('/order/delete/:id', 'OrderController.delete').as('order.delete')



}).prefix('admin').middleware(['auth', 'authCheck', 'passwordCheck'])


Route.group(() => {
    Route.get('/update/password', 'AuthController.updatePage').as('social.update.page')
    Route.post('/update/password/', 'AuthController.update').as('social.update')
}).prefix('user').middleware('passwordCheck')


Route.get('/error', 'PagesController.errorPage').as('page.error')
Route.get('/', 'PagesController.homePage').middleware('auth')
Route.get('/register', 'PagesController.registerPage').as('page.register')
Route.post('/register', 'UsersController.register').as('user.register')
Route.get('/login', 'PagesController.loginPage').as('page.login')
Route.post('/login', 'UsersController.login').as('user.login')
Route.get('/logout', 'UsersController.logout').as('user.logout')
Route.get('facebook', 'AuthController.redirectToFacebook').as('redirect.fb')
Route.get('facebook/callback', 'AuthController.handleFacebookCallback').as('callback.fb')
Route.get('google', 'AuthController.redirectToGoogle').as('redirect.gg')
Route.get('google/callback', 'AuthController.handleGoogleCallback').as('callback.gg')
Route.get('twitter', 'AuthController.redirectToTwitter').as('redirect.tt')
Route.get('twitter/callback', 'AuthController.handleTwitterCallback').as('callback.tt')
