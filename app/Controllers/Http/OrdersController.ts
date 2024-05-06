import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OrderService from 'App/Service/OrderService';

export default class OrderController {
    // ฟังก์ชันสำหรับทำการ checkout ตะกร้าสินค้า
    public async checkOut({ auth, response, request }: HttpContextContract) {
        try {
            // หา userId จากข้อมูลผู้ใช้ที่ login
            const userId = auth.user?.id;

            if (!userId) {
                throw new Error('User not authenticated');
            }

            const data = request.only(['total'])
            await OrderService.create(data);
            await OrderService.checkout(userId);

            return response.redirect().back()
        } catch (error) {
            return response.status(500).send({ error: error.message });
        }
    }
}
