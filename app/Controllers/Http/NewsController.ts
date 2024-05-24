import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import LogService from "App/Service/log_service";
import NewsService from "App/Service/news_service";
import uploadService from "App/Service/uploads_service";

export default class NewsController {
  public async newsUpdateList({ view, request }: HttpContextContract) {
    try {
      const filters: any = {};
      let page = request.input("page", 1); // รับค่าหน้าปัจจุบันจาก request
      const keyword = request.input("keyword");
      filters.keyword = keyword;

      const perPage = 4;
      const news: any = await NewsService.all({ filters });
      const startIndex = (page - 1) * perPage;
      const endIndex = Math.min(startIndex + perPage, news.length);
      const paginatedNews = news.slice(startIndex, endIndex);

      return view.render("admin/newsUpdateListPage", {
        items: paginatedNews,
        pagination: news,
        total: news.length,
        perPage: perPage,
        currentPage: parseInt(page),
        lastPage: Math.ceil(news.length / perPage),
      });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to open news list page"
      return view.render('error', { error })
    }
  }

  public async newsAdmin({ view }: HttpContextContract) {
    try {
      return view.render("admin/newsPage");
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to open admin news page"
      return view.render('error', { error })
    }
  }


  public async newsPage({ view }: HttpContextContract) {
    try {
      const news = await NewsService.getShowNews();
      return view.render("user/newsPage", { news });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to open news page"
      return view.render('error', { error })
    }
  }

  async addNews({ request, response, view }: HttpContextContract) {
    try {
      const data = request.only(["title", "description", "imgUrl", "content"]);
      const File = request.file("imagefile1", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const fileName1 = await uploadService.upload(File);

      if (File) {
        await uploadService.deleteFile(data.imgUrl);
        data.imgUrl = `uploads/${fileName1}`;
      }

      await NewsService.create(data);
      return response.redirect().back();
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to add news page"
      return view.render('error', { error })
    }
  }

  async updateNews({ view, params, request, response }: HttpContextContract) {
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
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to update news page"
      return view.render('error', { error })
    }
  }

  public async newsContent({ view, params }: HttpContextContract) {
    try {
      const id = params.id
      const items = await NewsService.findById(id)
      const item = items[0];
      return view.render("user/newsContent", { item });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to open user news page"
      return view.render('error', { error })
    }
  }


  async editNews({ params, view }: HttpContextContract) {
    try {
      const id = params.id;
      const news: any = await NewsService.findById(id);
      return view.render("admin/newsUpdatePage", { news });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to open open edit news page"
    }
  }

  async deleteNews({ response, params, view }: HttpContextContract) {
    try {
      await NewsService.delete(params.id);
      return response.redirect().toRoute("news.update.list");
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to delete page"
      return view.render('error', { error })
    }
  }




  public async toggleStatus({ params, response, view }: HttpContextContract) {
    try {
      const { id } = params;
      const news = await NewsService.findById(id);

      if (!news) {
        return response.status(404).json({ error: "News not found" });
      }
      if (news.status === "show" && news.status != 'hide') {
        news.status = "hide";
      } else if (news.status === 'hide' && news.status != 'show') {
        news.status = "show";
      }
      await NewsService.updateStatus(id, news);
      return response.redirect().back();
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to toggle status page"
      return view.render('error', { error })
    }
  }
}