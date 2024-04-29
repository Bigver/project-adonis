import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AboutService from 'App/Service/about_service';

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

    public async aboutAdmin({ view }: HttpContextContract) {  
      const filter = {
        id: 1
      };
      let aboutData: any = await AboutService.all({ filters: filter })
      aboutData =aboutData[0].serialize()   
      return view.render("admin/aboutPage" , {data : aboutData});
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
