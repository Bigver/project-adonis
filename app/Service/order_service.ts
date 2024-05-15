import Cart from "App/Models/Cart"
import CartItem from "App/Models/CartItem"
import Order from "App/Models/Order"
import OrderItem from "App/Models/OrderItem"
import _ from "lodash";

export default class OrderService {
    public static getOrderById({ filters = {} }: any) {
        const item = Order.query()
        if (_.result(filters, 'id')) {
            item.where('id', filters.id)
        }

        return item
    }

    public static async searchOrders(keyword: any, page: any) {
        const newsPaginator = await Order.query()
            .where('user_id', 'like', `%${keyword}%`)
            .orWhere('id', 'like', `%${keyword}%`).paginate(page)
        return newsPaginator;
    }

    public static async create(data: any) {
        try {
            const item = await Order.create(data)
            return item
        } catch (error) {
            throw new Error('Failed to create orders')
        }
    }

    public static async findOrderByUserId(userId: number) {
        return await Order.query().where('userId', userId);
    }

    public static async deleteCartByUserId(userId: number) {
        try {
            await Cart.query().where('userId', userId).delete();
        } catch (error) {
            throw new Error('Failed to delete user cart');
        }
    }

    public static async checkout(userId: number, total: number) {
        const cartItems = await CartItem.query()
            .whereHas('cart', (query) => {
                query.where('userId', userId);
            })
            .preload('product'); // โหลดข้อมูลสินค้าที่เกี่ยวข้องด้วย

        const order = await Order.create({ userId, total });
        const orderItems = cartItems.map((cartItem) => {
            return {
                orderId: order.id,
                productId: cartItem.productId,
                price: cartItem.product.price_product,
                quantity: cartItem.quantity,
            };
        });
        await OrderItem.createMany(orderItems);
        await CartItem.query()
            .whereHas('cart', (query) => {
                query.where('userId', userId);
            })
            .delete();
        await OrderService.deleteCartByUserId(userId);
        return order;

    }

    static async delete(id: any) {
        const item = await Order.findOrFail(id)
        return await item.delete()
    }

    static async changeStatus(id: any) {
        const item = await Order.findOrFail(id);
        switch (item.status) {
            case 'pending':
                item.status = 'processing'
                item.save();
                return item;
            case 'processing':
                item.status = 'shipped'
                item.save();
                return item;
            case 'shipped':
                item.status = 'recived'
                item.save();
                return item;
            case 'recived':
                item.status = 'pending'
                item.save();
                return item;
            default:
                return item;
        }
    }
}     