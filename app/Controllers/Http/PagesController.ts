import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NewsService from 'App/Service/NewsService';

export default class PagesController {
  public async loginPage({ view }: HttpContextContract) {
    return view.render("loginPage");
  }


  public async registerPage({ view }: HttpContextContract) {
    return view.render("registerPage");
  }

  public async homePage({ view }: HttpContextContract) {
    return view.render("user/homePage");
  }

  public async Dashboard({ view }: HttpContextContract) {
    return view.render("admin/Dashboard");
  }

  public async newsPage({ view }: HttpContextContract) {
    try {
      const news = await NewsService.getShowNews()
      return view.render('user/newsPage', { news });
    } catch (error) {
      // หากเกิดข้อผิดพลาด
      console.error(error);
      return view.render('errors.serverError');
    }
  }

  public async newsUpdateList({ view }: HttpContextContract) {
    try {
      const filter = {};
      const news = await NewsService.all({ filter: filter }).paginate(1, 10)
      const serializedNews = news.serialize();
      return view.render("admin/newsUpdateListPage", { news: serializedNews });
    } catch (error) {

    }


  }

  public async newsUpdatePage({ params, view }: HttpContextContract) {
    try {
      const filter = {};
      const news = await NewsService.all({ filter: filter }).paginate(1, 10)
      const serializedNews = news.serialize();
      const item = await NewsService.all({ filters: { id: params.id } })
      const items = item[0]
      return view.render('admin/newsUpdatePage', { news: items, items: serializedNews })
    } catch (error) {

    }
  }

  public async newsContent({ view, params }: HttpContextContract) {
    const items = await NewsService.all({ filters: { id: params.id } })
    const item = items[0]
    return view.render('user/newsContent', { item })
  }

  public async aboutAdmin({ view }: HttpContextContract) {
    return view.render("admin/aboutPage");
  }

  public async homeAdmin({ view }: HttpContextContract) {
    return view.render("admin/homePage");
  }

  public async productAdmin({ view }: HttpContextContract) {
    return view.render("admin/productPage");
  }

  public async interestingAdmin({ view }: HttpContextContract) {
    return view.render("admin/interestingPage");
  }

  public async newsAdmin({ view }: HttpContextContract) {
    return view.render("admin/newsPage");
  }

  public async contactAdmin({ view }: HttpContextContract) {
    return view.render("admin/contactPage");
  }
}
