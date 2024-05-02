import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AboutService from "App/Service/about_service";
import UserService from "App/Service/user_service";
import interestingsService from "App/Service/interestings_service";
import NewsService from "App/Service/NewsService";
import HomeService from "App/Service/home_service";
import ContactService from "App/Service/contact_service";

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

  public async errorPage({ view }: HttpContextContract) {
    return view.render("admin/error");
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

  public async newsUpdateList({ view }: HttpContextContract) {
    try {
      const filter = {};
      const news = await NewsService.all({ filter: filter }).paginate(1, 10);
      const serializedNews = news.serialize();
      return view.render("admin/newsUpdateListPage", { news: serializedNews });
    } catch (error) {}
  }

  public async userAdmin({ view }: HttpContextContract) {
    const filters = {};
    let users: any = await UserService.all({ filters: filters });
    return view.render("admin/userPage", { userAll: users });
  }

  public async userUpdateAdmin({ view, params }: HttpContextContract) {
    const id = params.id;
    const filters = { id: id };
    let users: any = await UserService.all({ filters: filters });
    users = users[0].serialize();
    return view.render("admin/userUpdatePage", { users });
  }

  public async aboutAdmin({ view }: HttpContextContract) {
    const filter = {
      id: 1,
    };
    let aboutData: any = await AboutService.all({ filters: filter });
    if (aboutData.length != 0) {
      aboutData = aboutData[0].serialize();
    }
    return view.render("admin/aboutPage", { data: aboutData });
  }

  public async newsUpdatePage({ params, view }: HttpContextContract) {
    try {
      const filter = {};
      const news = await NewsService.all({ filter: filter }).paginate(1, 10);
      const serializedNews = news.serialize();
      const item = await NewsService.all({ filters: { id: params.id } });
      const items = item[0];
      return view.render("admin/newsUpdatePage", {
        news: items,
        items: serializedNews,
      });
    } catch (error) {}
  }

  public async newsContent({ view, params }: HttpContextContract) {
    const items = await NewsService.all({ filters: { id: params.id } });
    const item = items[0];
    return view.render("user/newsContent", { item });
  }

  public async productListAdmin({ view }: HttpContextContract) {
    return view.render("admin/productListPage");
  }

  public async interestingAdmin({ view }: HttpContextContract) {
    return view.render("admin/interestingPage");
  }

  public async homeAdmin({ view }: HttpContextContract) {
    const filter = {
      id: 1
    };
    let homeData: any = await HomeService.all({ filters: filter })
      if (homeData.length != 0){
        homeData = homeData[0].serialize() 
      }

    return view.render("admin/homeAdmin" , {home : homeData});
  }

  public async contactAdmin({ view }: HttpContextContract) {
    const filter = {
      id: 1
    };
    let contactData: any = await ContactService.all({ filters: filter })
    if (contactData.length != 0){
      contactData = contactData[0].serialize() 
    }
    return view.render("admin/contactPage" , {data : contactData});
  }

  public async showInteresting({ view }: HttpContextContract) {
    const filter = {};
    const item = await interestingsService
      .all({ filter: filter })
      .paginate(1, 10);
    const items = item.serialize();

    return view.render("admin/interestingListPage", { items });
  }

  public async UpdateinterestingPage({ view }: HttpContextContract) {
    return view.render("admin/UpdateInterestingPage");
  }
  public async productAdmin({ view }: HttpContextContract) {
    return view.render("admin/productPage");
  }

  public async newsAdmin({ view }: HttpContextContract) {
    return view.render("admin/newsPage");
  }
}
