import OrderItem from 'App/Models/OrderItem';
import _ from 'lodash'

export default class OrderItemService {
    public static async getItemById(orderId: number) {
        try {
            let quary = OrderItem.query().where('orderId', orderId);
            const item = await quary.preload('product');
            return item
        } catch (error) {
            throw new Error('Fail to get orders')
        }
    }
}
