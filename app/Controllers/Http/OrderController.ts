import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UrlService from "App/Service/get_url_service";
import LogService from "App/Service/log_service";
import OrderItemService from "App/Service/order_item_service";
import OrderService from "App/Service/order_service";

export default class OrdersController {
  public async order({ view, request, auth }: HttpContextContract) {
    try {
      const filter = {};
      let page = request.input("page", 1); // รับค่าหน้าปัจจุบันจาก request
      const limit = 10; // จำนวนรายการต่อหน้า
      page = Math.max(page, 1);
      let orders: any;
      const keyword = request.input("keyword");
      let ordersPaginator: any;
      if (keyword) {
        ordersPaginator = await OrderService.searchOrders(keyword, page);
      } else {
        ordersPaginator = await OrderService.getOrderById({ filter: filter }).paginate(
          page,
          limit
        );
      }
      orders = ordersPaginator.serialize();
      const paginationLinks = await UrlService.getUrlsForRange(
        1,
        ordersPaginator.lastPage
      );
      return view.render("user/order", {
        orderItem: orders,
        pagination: ordersPaginator,
        paginationLinks,
        keyword,
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

      const orders = await OrderService.getOrderById({ filters: { id: orderId } });
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