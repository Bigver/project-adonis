import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AboutService from "App/Service/about_service";
import UserService from "App/Service/user_service";
import interestingsService from "App/Service/interestings_service";
import NewsService from "App/Service/NewsService";
import HomeService from "App/Service/home_service";
import ContactService from "App/Service/contact_service";
import UrlService from "App/Service/getUrl_service";

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

  public async newsUpdateList({ view , request }: HttpContextContract) {
    try {
      const filter = {};
      let page = request.input('page', 1); // รับค่าหน้าปัจจุบันจาก request
      const limit = 10; // จำนวนรายการต่อหน้า
      page = Math.max(page, 1);
      let news : any
      const keyword = request.input('keyword')
      let newsPaginator : any
      
      if (keyword){
        newsPaginator = await NewsService.searchNews(keyword , page);
      } else {
        newsPaginator = await NewsService.all({ filter: filter }).paginate(page, limit);        
      }
      news = newsPaginator.serialize();

      const paginationLinks = await UrlService.getUrlsForRange(1, newsPaginator.lastPage);
      return view.render("admin/newsUpdateListPage", { news ,  pagination: newsPaginator, paginationLinks , keyword  });
    } catch (error) {
      console.log(error)
    }
  }

  public async userAdmin({ view , request }: HttpContextContract) {
    try {
      const filter = {};
      let page = request.input('page', 1); // รับค่าหน้าปัจจุบันจาก request
      const limit = 2; // จำนวนรายการต่อหน้า
      page = Math.max(page, 1);
      let users : any
      const keyword = request.input('keyword')
      let usersPaginator : any
      
      if (keyword){
        usersPaginator = await UserService.searchUser(keyword , page);
      } else {
        usersPaginator = await UserService.all({ filter: filter }).paginate(page, limit);        
      }
      users = usersPaginator.serialize();
      const paginationLinks = await UrlService.getUrlsForRange(1, usersPaginator.lastPage);
      return view.render("admin/userPage", { users ,  pagination: usersPaginator, paginationLinks , keyword  });
    } catch (error) {
      console.log(error)
    }
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
    return view.render("admin/aboutPage", { data: aboutData  });
  }

  public async newsUpdatePage({ params, view }: HttpContextContract) {
      const filter = {};
      const news = await NewsService.all({ filter: filter }).paginate(1, 10);
      const serializedNews = news.serialize();
      const item = await NewsService.all({ filters: { id: params.id } });
      const items = item[0];
      return view.render("admin/newsUpdatePage", { news: items, items: serializedNews, });
  }

  public async profilePage({ view }: HttpContextContract) {
    return view.render("admin/userProfile");
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

  public async showInteresting({ view , request}: HttpContextContract) {
    try {
      const filter = {};
      let page = request.input('page', 1); // รับค่าหน้าปัจจุบันจาก request
      const limit = 2; // จำนวนรายการต่อหน้า
      page = Math.max(page, 1);
      let interestings : any
      const keyword = request.input('keyword')
      let interestingsPaginator : any
      
      if (keyword){
        interestingsPaginator = await interestingsService.searchinteresting(keyword , page);
      } else {
        interestingsPaginator = await interestingsService.all({ filter: filter }).paginate(page, limit);        
      }
      interestings = interestingsPaginator.serialize();
      const paginationLinks = await UrlService.getUrlsForRange(1, interestingsPaginator.lastPage);
      return view.render("admin/interestingListPage", { items : interestings ,  pagination: interestingsPaginator, paginationLinks , keyword  });
    } catch (error) {
      console.log(error)
    }
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
