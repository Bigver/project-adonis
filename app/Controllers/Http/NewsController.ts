import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UrlService from "App/Service/get_url_service";
import NewsService from "App/Service/news_service";
import uploadService from "App/Service/uploads_service";

export default class NewsController {
  public async newsAdmin({ view }: HttpContextContract) {
    return view.render("admin/newsPage");
  }

  public async newsPage({ view }: HttpContextContract) {
    try {
      const news = await NewsService.getShowNews();
      return view.render("user/newsPage", { news });
    } catch (error) {
      // หากเกิดข้อผิดพลาด
      console.error(error);
      return view.render("errors.serverError");
    }
  }

  public async newsUpdateList({ view, request }: HttpContextContract) {
    try {
      const filter = {};
      let page = request.input("page", 1); // รับค่าหน้าปัจจุบันจาก request
      const limit = 10; // จำนวนรายการต่อหน้า
      page = Math.max(page, 1);
      let news: any;
      const keyword = request.input("keyword");
      let newsPaginator: any;

      if (keyword) {
        newsPaginator = await NewsService.searchNews(keyword, page);
      } else {
        newsPaginator = await NewsService.all({ filter: filter }).paginate(
          page,
          limit
        );
      }
      news = newsPaginator.serialize();

      const paginationLinks = await UrlService.getUrlsForRange(
        1,
        newsPaginator.lastPage
      );
      return view.render("admin/newsUpdateListPage", {
        news,
        pagination: newsPaginator,
        paginationLinks,
        keyword,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async newsUpdatePage({ params, view }: HttpContextContract) {
    const filter = {};
    const news = await NewsService.all({ filter: filter }).paginate(1, 10);
    const serializedNews = news.serialize();
    const item = await NewsService.all({ filters: { id: params.id } });
    const items = item[0];
    return view.render("admin/newsUpdatePage", {
      news: items,
      items: serializedNews,
    });
  }

  public async newsContent({ view, params }: HttpContextContract) {
    const items = await NewsService.all({ filters: { id: params.id } });
    const item = items[0];
    return view.render("user/newsContent", { item });
  }

  async add({ request, response }: HttpContextContract) {
    try {
      const data = request.only(["title", "description", "imgUrl", "content"]);
      const File = request.file("imagefile1", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const fileName1 = await uploadService.upload(File);

      if (File) {
        await uploadService.deleteFile(data.imgUrl);
        data.imgUrl = `/uploads/${fileName1}`;
      }

      await NewsService.create(data);
      return response.redirect().back();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to add News" });
    }
  }

  async update({ params, request, response }: HttpContextContract) {
    try {
      const { id } = params;
      const data = request.only(["title", "description", "imgUrl", "content"]);
      const File = request.file("imagefile1", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const fileName1 = await uploadService.upload(File);

      if (File) {
        await uploadService.deleteFile(data.imgUrl);
        data.imgUrl = `/uploads/${fileName1}`;
      }

      await NewsService.update(id, data);
      return response.redirect().toRoute("news.update.list");
    } catch (error) {
      response.badRequest(error.message);
    }
  }

  public async toggleStatus({ params, response }: HttpContextContract) {
    try {
      const { id } = params;
      const news = await NewsService.findById(id);

      if (!news) {
        return response.status(404).json({ error: "News not found" });
      }

      news.status = news.status === "show" ? "hide" : "show";
      await news.save();
      return response.redirect().back();
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ error: "Failed to toggle news status" });
    }
  }

  async delete({ response, params }: HttpContextContract) {
    await NewsService.delete(params.id);
    return response.redirect().toRoute("news.update.list");
  }
}
