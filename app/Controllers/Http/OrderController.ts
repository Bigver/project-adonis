import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OrderService from 'App/Service/OrderService';

export default class OrdersController {

    public async checkOut({ auth, response, request }: HttpContextContract) {
        try {
            // หา userId จากข้อมูลผู้ใช้ที่ login
            const userId = auth.user?.id;

            if (!userId) {
                throw new Error('User not authenticated');
            }

            const total = request.input('total')
            await OrderService.checkout(userId, total);

            return response.redirect().back()
        } catch (error) {
            return response.status(500).send({ error: error.message });
        }
    }

    async changeStatusOrder({response,params} : HttpContextContract) {
        await OrderService.changeStatus(params.id)
        return response.redirect().back()
    }

}
