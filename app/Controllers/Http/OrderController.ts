import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import LogService from "App/Service/log_service";
import OrderItemService from "App/Service/order_item_service";
import OrderService from "App/Service/order_service";

export default class OrdersController {
  public async order({ view, request ,auth }: HttpContextContract) {
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
      const { level, message, context } = {
        level: "warn",
        message: "Can't open order page",
        context: {
          userId: auth.user?.id
        }
      };
      await LogService.create(level, message, context);
      error = "Failed to open order page"
      return view.render('error', { error })
    }
  }


  public async orderDetail({ view, params, auth }: HttpContextContract) {
    try {
      const orderId = params.id;
      const item = await OrderItemService.getItemById(orderId);

      const orders = await OrderService.all({ filters: { id: orderId } });
      const order = orders.map((item) => item.serialize());

      return view.render("user/orderDetail", { item, order });
    } catch (error) {
      const { level, message, context } = {
        level: "warn",
        message: "Failed to open order detail page",
        context: {
          userId: auth.user?.id
        }
      };
      await LogService.create(level, message, context);
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
      const { level, message, context } = {
        level: "warn",
        message: "Check out failed",
        context: {
          userId: request.input('userId'),
        }
      };
      await LogService.create(level, message, context);
      error = "check out failed"
      return view.render('error', { error })
    }
  }

  public async changeStatusOrder({ view, response, params }: HttpContextContract) {
    try {
      await OrderService.changeStatus(params.id);
      return response.redirect().back();
    } catch (error) {
      const { level, message, context } = {
        level: "warn",
        message: "change status failed",
        context: {}
      };
      await LogService.create(level, message, context);
      error = "change status failed"
      return view.render('error', { error })
    }
  }
}