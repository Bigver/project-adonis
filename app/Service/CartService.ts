import Cart from "App/Models/Cart"
import CartItem from "App/Models/CartItem"
import Order from "App/Models/Order"
import OrderItem from "App/Models/OrderItem"
import _ from 'lodash'

export default class CartService {
    public static async all({ filters = {} }: any) {
        try {
            const item = Cart.query()
            if (_.result(filters, 'id')) {
                item.where('id', filters.id)
            }
            return item
        } catch (error) {
            throw new Error('Failed to get all')
        }
    }

    public static getAll(filters?: any) {
        let query = Cart.query()

        if (filters && filters.id) {
            query = query.where('id', '=', filters.id)
        }

        // Return the query builder to allow chaining
        return query
    }

    public static getItemAll(filters?: any) {
        let query = CartItem.query()

        if (filters && filters.id) {
            query = query.where('id', '=', filters.id)
        }

        // Return the query builder to allow chaining
        return query
    }

    static async decreaseProduct(id: any) {
        const item = await CartItem.findOrFail(id);

        if (item.quantity > 1) {
            item.quantity = item.quantity - 1;
            await item.save();
            return item;
        } else {
            // ถ้า quantity เป็น 0 ให้ลบ item ออกจากตะกร้า
            await item.delete();
            return null; // หรือคืนค่าอะไรก็ตามตามที่ต้องการ
        }
    }

    static async increaseProduct(id: any) {
      const item = await CartItem.findOrFail(id);
      item.quantity = item.quantity + 1;
      await item.save();
      return item;
  }

    public static async checkout(userId: number) {
        try {
            // หาข้อมูล cart ของ user จาก userId
            const cartItems = await CartItem.query()
                .whereHas('cart', (query) => {
                    query.where('userId', userId);
                })
                .preload('product'); // โหลดข้อมูลสินค้าที่เกี่ยวข้องด้วย

            // สร้าง order ใหม่
            const order = await Order.create({ userId, status: 'pending' });

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

            return order;
        } catch (error) {
            throw new Error('Failed to checkout');
        }
    }



    public static async itemAll({ filters = {} }: any) {
        try {
            const item = CartItem.query()
            if (_.result(filters, 'id')) {
                item.where('id', filters.id)
            }
            return item
        } catch (error) {
            throw new Error('Failed to get all')
        }


    }

    public static async create(data: any) {
        try {
            const existingCartItem = await Cart.query()
                .where('userId', data.userId)
                .first()

            if (existingCartItem) {
                existingCartItem.merge(data)
                await existingCartItem.save()
                return existingCartItem
            } else {
                const newItem = await Cart.create(data)
                return newItem
            }
        } catch (error) {
            throw new Error('Failed to create cart')
        }
    }

    public static async createDetail(data: any) {
        try {
            const existingCartItem = await CartItem.query()
                .where('cartId', data.cartId)
                .where('productId', data.productId)
                .first();

            if (existingCartItem) {
                existingCartItem.quantity += parseInt(data.quantity);
                existingCartItem.totalPrice += parseInt(data.totalPrice);
                await existingCartItem.save();
            } else {
                const product = await CartItem.create(data)
                return product
            }
        } catch (error) {
            throw new Error('Failed to create cartitem')
        }

    }

    public static async findCartByUserId(userId: number) {
        return await Cart.query().where('userId', userId).first();
    }


    public static async getCartByUser(userId: number) {
        try {
            const cartItem = await CartItem.query()
            .whereHas('cart', (query) => {
                query.where('userId', userId);
            })
            .preload('product');
            return cartItem
        } catch (error) {
            throw new Error('Failed to get cart by user')
        }
    }
}