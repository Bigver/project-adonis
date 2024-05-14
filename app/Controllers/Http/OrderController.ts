import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UrlService from "App/Service/get_url_service";
import OrderService from "App/Service/order_service";

export default class OrdersController {
  public async order({ view, request }: HttpContextContract) {
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
      ordersPaginator = await OrderService.all({ filter: filter }).paginate(
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
  }
  catch(error) {
    console.log(error);
  }

  public async orderDetail({ view, params }: HttpContextContract) {
    try {
      const orderId = params.id;
      const item = await OrderService.itemAll(orderId);

      const orders = await OrderService.all({ filters: { id: orderId } });
      const order = orders.map((item) => item.serialize());

      return view.render("user/orderDetail", { item, order });
    } catch (error) {
      console.error(error);
      // ส่งข้อผิดพลาดไปยัง view สำหรับการแสดงผล
      return view.render("error", { message: "Failed to load order detail" });
    }
  }

  public async checkOut({ auth, response, request }: HttpContextContract) {
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
      return response.status(500).send({ error: error.message });
    }
  }

  public async changeStatusOrder({ response, params }: HttpContextContract) {
    await OrderService.changeStatus(params.id);
    return response.redirect().back();
  }
}
