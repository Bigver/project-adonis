import Cart from "App/Models/Cart"
import _ from 'lodash'

export default class CartService {
    public static async all({ filters = {} }: any) {
        const item = Cart.query()
        if (_.result(filters, 'id')) {
            item.where('id', filters.id)
        }
        return item
    }

    public static async findByUserId(userId: number) { // Cart
        return await Cart.query().where('userId', userId).first();
    }

    public static async create(data: any) {
        const item = await Cart.query()
            .where('userId', data.userId)
            .first();
        if (item) {
            item.merge(data);
            await item.save();
            return item;
        } else {
            const newItem = await Cart.create(data);
            return newItem;
        }
    }
}