import CartItem from "App/Models/CartItem"
import _ from 'lodash'

export default class CartItemsService {
    public static getItemById(filters?: any) { // 
        let query = CartItem.query();
        if (filters && filters.id) {
            query = query.where('id', '=', filters.id);
        }
        return query;
    }

    public static async getCartByUser(userId: number) { // Cart Items
        const cartItem = await CartItem.query()
            .whereHas('cart', (query) => {
                query.where('userId', userId);
            })
            .preload('product');
        return cartItem;
    }

    public static async decreaseProduct(id: any) {
        const item = await CartItem.findOrFail(id);
        if (item.quantity > 1) {
            item.quantity = item.quantity - 1;
            await item.save();
            return item;
        } else {
            await item.delete();
            return null;
        }
    }

    public static async create(data: any) {
        const item = await CartItem.query()
            .where('cartId', data.cartId)
            .where('productId', data.productId)
            .first();

        if (item) {
            item.quantity += parseInt(data.quantity);
            item.totalPrice += parseInt(data.totalPrice);
            await item.save();
        } else {
            const item = await CartItem.create(data);
            return item;
        }
    }

    public static async increaseProduct(id: any) {
        const item = await CartItem.findOrFail(id);
        item.quantity = item.quantity + 1;
        await item.save();
        return item;
    }
}
