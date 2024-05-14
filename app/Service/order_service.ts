import Cart from "App/Models/Cart"
import CartItem from "App/Models/CartItem"
import Order from "App/Models/Order"
import OrderItem from "App/Models/OrderItem"
import _ from "lodash";

export default class OrderService {
    public static all({ filters = {} }: any) {
        const item = Order.query()
        if (_.result(filters, 'id')) {
            item.where('id', filters.id)
        }

        return item
    }

    public static async searchOrders(keyword : any , page : any) {
        const newsPaginator = await Order.query()
        .where('user_id', 'like', `%${keyword}%`)
        .orWhere('id', 'like', `%${keyword}%`).paginate(page)
        return newsPaginator;
      }
        

    public static getAll(filters?: any) {
        let query = Order.query()

        if (filters && filters.id) {
            query = query.where('id', '=', filters.id)
        }

        // Return the query builder to allow chaining
        return query
    }

    public static async itemAll( orderId: number) {
        try {
            let quary = OrderItem.query().where('orderId', orderId);
            const item = await quary.preload('product');
            return item
        } catch (error) {
            throw new Error('Fail to get orders')
        }
    }

    public static async create(data: any) {
        try {
            const item = await Order.create(data)
            return item
        } catch (error) {
            throw new Error('Failed to create orders')
        }
    }

    public static async createDetail(data: any) {
        try {
            const item = await OrderItem.create(data)
            return item
        } catch (error) {
            throw new Error('Failed to create orders detail')
        }
    }

    public static async findOrderByUserId(userId: number) {
        return await Order.query().where('userId', userId);
    }

    public static async deleteCartByUserId(userId: number) {
        try {
            // ค้นหาและลบ Cart ของผู้ใช้ที่มี userId ที่กำหนด
            await Cart.query().where('userId', userId).delete();
        } catch (error) {
            throw new Error('Failed to delete user cart');
        }
    }

    public static async checkout(userId: number, total: number) {
        try {
            // หาข้อมูล cart ของ user จาก userId
            const cartItems = await CartItem.query()
                .whereHas('cart', (query) => {
                    query.where('userId', userId);
                })
                .preload('product'); // โหลดข้อมูลสินค้าที่เกี่ยวข้องด้วย

            // สร้าง order ใหม่
            const order = await Order.create({ userId , total});

            // สร้าง order items โดยใช้ข้อมูลจาก cart items
            const orderItems = cartItems.map((cartItem) => {
                return {
                    orderId: order.id,
                    productId: cartItem.productId,
                    price: cartItem.product.price_product, // ราคาสินค้า
                    quantity: cartItem.quantity,
                };
            });

            // บันทึก order items
            await OrderItem.createMany(orderItems);

            // ลบ cart items ที่ถูก checkout ออกจากตะกร้า
            await CartItem.query()
                .whereHas('cart', (query) => {
                    query.where('userId', userId);
                })
                .delete();

            await OrderService.deleteCartByUserId(userId);
            return order;
        } catch (error) {
            throw new Error('Failed to checkout');
        }
    }

    static async delete(id: any) {
        const item = await Order.findOrFail(id)
        return await item.delete()
    }

    public static async getOrderByUser(userId: number) {
        try {
            const orderItem = await Order.query().where('userId', userId);
            return orderItem
            }
         catch (error) {
            throw new Error('Failed to get order by user')
        }
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