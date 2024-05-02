import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AboutService from 'App/Service/about_service';
import UserService from 'App/Service/user_service';
import interestingsService from 'App/Service/interestings_service';

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

    public async userAdmin({ view }: HttpContextContract) {  
      const filters = {}  
      let users: any = await UserService.all({ filters: filters });
      return view.render("admin/userPage" , {userAll : users});
    }

    public async userUpdateAdmin({ view , params }: HttpContextContract) {  
      const id = params.id
      const filters = { id : id }  
      let users: any = await UserService.all({ filters: filters });
      users = users[0].serialize()
      return view.render("admin/userUpdatePage" , {users});
    }

    public async aboutAdmin({ view }: HttpContextContract) {  
      const filter = {
        id: 1
      };
      let aboutData: any = await AboutService.all({ filters: filter })
      if (aboutData.length != 0){
        aboutData = aboutData[0].serialize() 
      }
      return view.render("admin/aboutPage" , {data : aboutData});
    }

    public async homeAdmin({ view }: HttpContextContract) {    
      return view.render("admin/homePage");
    }

    public async productAdmin({ view }: HttpContextContract) {    
      return view.render("admin/productPage");
    }

    public async productListAdmin({ view }: HttpContextContract) {    
      return view.render("admin/productListPage");
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


    public async showInteresting({ view }: HttpContextContract) {   
      const filter = {}
      const item = await interestingsService.all({filter:filter}).paginate(1,10)
      const items = item.serialize()

      return view.render("admin/interestingListPage", {items});
    }

    public async UpdateinterestingPage({ view }: HttpContextContract) {    
      return view.render("admin/UpdateInterestingPage");
    }
}
