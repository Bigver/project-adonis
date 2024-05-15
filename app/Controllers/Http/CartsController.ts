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
            console.log(error)
            const { level, message, context } = {
                level: "warn",
                message: "Failed to open Shop Cart page",
                context: {
                    userId: auth.user?.id
                }
            };
            await LogService.create(level, message, context);
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
            const { level, message, context } = {
                level: "warn",
                message: "Add cart failed",
                context: {
                    userId: request.input('userId'),
                    productId: request.input('productId'),
                    quantity: request.input('quantity')
                }
            };
            await LogService.create(level, message, context);
            error = "add cart failed"
            return view.render('error', { error })
        }
    }

    async increaseProductQuantityInCart({ view, response, params }: HttpContextContract) {
        try {
            await CartItemsService.increaseProduct(params.id)
            return response.redirect().back()
        } catch (error) {
            const { level, message, context } = {
                level: "warn",
                message: "failed to increse product quantity",
                context: {
                    params: params.id
                }
            }
            await LogService.create(level, message, context);
            error = "failed to increse product quantity"
            return view.render('error', { error })
        }
    }

    async decreaseProductQuantityInCart({ view, response, params }: HttpContextContract) {
        try {
            await CartItemsService.decreaseProduct(params.id)
            return response.redirect().back()
        } catch (error) {
            const { level, message, context } = {
                level: "warn",
                message: "failed to decrease product quantity",
                context: {
                    params: params.id
                }
            }
            await LogService.create(level, message, context);
            error = "failed to decrease product quantity"
            return view.render('error', { error })
        }
    }
}