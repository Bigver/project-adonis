import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CartService from 'App/Service/cart_service';

export default class CartsController {
    
  // public async shopCart({ view, auth }: HttpContextContract) {
  //   try {
  //     // ดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
  //     const user = auth.user?.serialize();

  //     const filter = {};


  //     // ตรวจสอบว่ามีผู้ใช้ที่เข้าสู่ระบบหรือไม่
  //     if (!user) {
  //       return view.render('errors.unauthorized');
  //     }

  //     // ดึงรายการสินค้าในตะกร้าของผู้ใช้
  //     const cart = await CartService.getItemAll({ filters: { userId: user.id } }).preload('product').paginate(1, 10);
  //     const carts = cart.serialize();

  //     const cartItem = await CartService.getCartByUser(user.id)
  //     const item = await ProductService.all({ filter: filter }).paginate(1, 10);
  //     const items = item.serialize()

  //     // ดึงรายการสินค้าในตะกร้าทั้งหมดของผู้ใช้
  //     const cartItems = await CartService.itemAll({ filter: { userId: user.id } });
  //     const serializedCartItems = cartItems.map((item) => item.serialize());

  //     // คำนวณยอดรวมของรายการสินค้าในตะกร้า
  //     let total = 0;
  //     serializedCartItems.forEach((item: any) => {
  //       total += item.total_price;
  //     });

  //     // ส่งข้อมูลไปยังแม่แบบเพื่อแสดงผล
  //     return view.render("user/shopcartPage", { user: user, items, cartData: carts, total, cartItem });
  //   } catch (error) {
  //     console.error(error);
  //     return view.render("errors.something_went_wrong");
  //   }
  // }


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
