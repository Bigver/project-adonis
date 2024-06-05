import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CartItemsService from 'App/Service/cart_item_service';
import CartService from 'App/Service/cart_service';
import LogService from 'App/Service/log_service';
import ProductService from 'App/Service/product_service';

export default class CartsController {

    async shopCart({ view, auth }: HttpContextContract) {
        try {
            const user = auth.user?.serialize();
            const filter = {};
            if (!user) {
                return view.render('errors.unauthorized');
            }
            const carts = await CartItemsService.getCartByUser(user.id) //Items
            const cartItem = await CartService.findByUserId(user.id) //Cart
            const items = await ProductService.all({ filter: filter })

            const serializedCartItems = carts.map((item) => item.serialize());
            let total = 0;
            serializedCartItems.forEach((item: any) => {
                total += item.total_price;
            });

            return view.render("user/shopcartPage", { user: user, items, cartData: carts, total, cartItem });
        } catch (error) {
            const message = error.message || JSON.stringify(error);
            const level = "warn"
            LogService.create(level, message);
            error = "Failed to open Shop Cart page"
            return view.render('error', { error })
        }
    }


    async addCart({ request, response, view }: HttpContextContract) {
        try {
            const userId = request.input('userId');
            let cart;
            const cartData = await CartService.findByUserId(userId);
            if (!cartData) {
                const data = { userId };
                cart = await CartService.create(data);
            } else {
                cart = cartData;
            }
            const detail = {
                cartId: cart.id,
                productId: request.input('productId'),
                quantity: request.input('quantity')
            };
            await CartItemsService.create(detail);
            return response.redirect().back()
        } catch (error) {
            const message = error.message || JSON.stringify(error);
            const level = "warn"
            LogService.create(level, message);
            error = "add cart failed"
            return view.render('error', { error })
        }
    }

    async increaseProductQuantityInCart({ view, response, params }: HttpContextContract) {
        try {
            await CartItemsService.increaseProduct(params.id)
            return response.redirect().back()
        } catch (error) {
            const message = error.message || JSON.stringify(error);
            const level = "warn"
            LogService.create(level, message);
            error = "failed to increse product quantity"
            return view.render('error', { error })
        }
    }
}

