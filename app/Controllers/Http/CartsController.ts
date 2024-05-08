import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CartService from 'App/Service/CartService';

export default class CartsController {

    async addCart({ request, response }: HttpContextContract) {
        try {
            const userId = request.input('userId');
            let cart;


            const existingCart = await CartService.findCartByUserId(userId);

            if (!existingCart) {
                const data = { userId };
                cart = await CartService.create(data);
            } else {
                cart = existingCart;
            }

            const detail = {
                cartId: cart.id,
                productId: request.input('productId'),
                quantity: request.input('quantity')
            };

            await CartService.createDetail(detail);
            return response.redirect().back()
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Failed to add Cart detail' });
        }
    }

    async decreaseProductQuantityInCart({response,params} : HttpContextContract) {
        await CartService.decreaseProduct(params.id)
        return response.redirect().back()
    }

    async increaseProductQuantityInCart({response,params} : HttpContextContract) {
        await CartService.increaseProduct(params.id)
        return response.redirect().back()
    }

}
