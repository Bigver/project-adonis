import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import LogService from "App/Service/log_service";
import OrderItemService from "App/Service/order_item_service";
import OrderService from "App/Service/order_service";

export default class OrdersController {
  public async order({ view, request }: HttpContextContract) {
    try {
      const filters: any = {};
      let page = request.input("page", 1); // รับค่าหน้าปัจจุบันจาก request

      const perPage = 10;
      const keyword = request.input("keyword");
      filters.keyword = keyword;

      const orders = await OrderService.all({ filters });
      const startIndex = (page - 1) * perPage;
      const endIndex = Math.min(startIndex + perPage, orders.length);
      const paginatedOrders = orders.slice(startIndex, endIndex);

      return view.render("user/order", {
        orderItem: paginatedOrders,
        pagination: orders,
        total: orders.length,
        perPage: perPage,
        currentPage: parseInt(page),
        lastPage: Math.ceil(orders.length / perPage),
      });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      LogService.create(level, message);
      error = "Failed to open order page"
      return view.render('error', { error })
    }
  }


  public async orderDetail({ view, params, auth }: HttpContextContract) {
    try {
      const orderId = params.id;
      const item = await OrderItemService.getItemById(orderId);
      const count = item ? item.length : 0;

      const orders = await OrderService.all({ filters: { id: orderId } });
      const order = orders.map((item) => item.serialize());

      const user = auth.user?.serialize()

      return view.render("user/orderDetail", { item, order, user, count });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      LogService.create(level, message);
      error = "Failed to open order detail page"
      return view.render('error', { error })
    }
  }


  public async checkOut({ view, auth, response, request }: HttpContextContract) {
    try {
      // หา userId จากข้อมูลผู้ใช้ที่ login
      const userId = auth.user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const total = request.input("total");
      await OrderService.checkout(userId, total);

      return response.redirect().back();
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      LogService.create(level, message);
      error = "check out failed"
      return view.render('error', { error })
    }
  }

  public async changeStatusOrder({ view, response, params }: HttpContextContract) {
    try {
      await OrderService.changeStatus(params.id);
      return response.redirect().back();
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      LogService.create(level, message);
      error = "change status failed"
      return view.render('error', { error })
    }
  }

  async delete({ response, params, view }: HttpContextContract) {
    try {
      await OrderService.delete(params.id);
      return response.redirect().back()
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      LogService.create(level, message);
      error = "Failed to delete orders"
      return view.render('error', { error })
    }
  }
}