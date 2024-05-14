import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Hash from "@ioc:Adonis/Core/Hash";
import UserService from "App/Service/user_service";
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import UrlService from "App/Service/getUrl_service";
// import * as Pusher from 'pusher-js'

export default class UsersController {


  async register({ request, response , session }: HttpContextContract) {
    const newUserSchema = schema.create({
      username: schema.string(),
      email: schema.string([
        rules.email()
      ]),
      password: schema.string([
        rules.minLength(4)
      ])
    })
    const payload = await request.validate({
      schema: newUserSchema
    })
    try {
      await UserService.createUser(payload);
      return response.redirect().toRoute('page.login')
    } catch (error) {
      session.flash('error', 'Email นี้อาจมีผู้ใช้งานแล้ว')
      return response.redirect().back()
    }
  }

  async update({ params , request, response } : HttpContextContract) {
    const { id } = params
    const { user_admin  ,  check_admin ,  pages_admin } = request.all() || null;
    let accessData : any
    const userAdmin = user_admin || "no"
    const checkAdmin = check_admin  || "no"
    const pageAdmin = pages_admin || "no"

    accessData = [];

    accessData.push({
      userAdmin,
      checkAdmin,
      pageAdmin
    });
    const access = JSON.stringify(accessData);

    const userData = request.only(['email', 'username' , 'password' , 'role'])
    await UserService.updateUser( id , userData , access)
    return response.redirect().toRoute('admin.user')
  }

  async updateProfile({ params , request, response } : HttpContextContract) {
    const id = params.id
    const userData = request.only(['email', 'username' , 'password' , 'role'])
    await UserService.updateProfile( id , userData)
    return response.redirect().toRoute('admin.user')
  }




  async destroy({response , params} : HttpContextContract){
    await UserService.delete(params.id)
    return response.redirect('back')
}

  async login({ request, response, auth , session }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    
    try {     
      
      const user = await UserService.login(email)
      if (!(await Hash.verify(user.password, password))) {
        session.flash('error', 'Email หรือ password ไม่ถูกต้อง')
        return response.redirect().back()    
      }
      await auth.use("web").attempt(email, password);
      const authUser: any = auth.user?.serialize();
      if (authUser.role == "admin"){
        return response.redirect().toRoute('admin.dashboard')
      } else{
        return response.redirect('/')
      }

    } catch (error) {
      session.flash('error', 'Email หรือ password ไม่ถูกต้อง')
      return response.redirect().back()
    }
  }

  async logout( { response  , auth} :HttpContextContract){   
    await auth.use('web').logout()
    return response.redirect().toRoute('page.login')
}

public async userAdmin({ view , request }: HttpContextContract) {
  try {
    let filters : any = {};
    let page = request.input('page', 1); // รับค่าหน้าปัจจุบันจาก request
    // const perPage = request.input('perPage', 10)
    const perPage = 10; // จำนวนรายการต่อหน้า
    // page = Math.max(page, 1);
    const keyword = request.input('keyword')
    filters.keyword = keyword

    const users : any = await UserService.all({filters})   
    const startIndex = (page - 1) * perPage
    const endIndex = Math.min(startIndex + perPage, users.length)
    const paginatedUsers = users.slice(startIndex, endIndex)


    return view.render("admin/userPage", { users : paginatedUsers ,  pagination: users , 
      total: users.length,
      perPage: perPage,
      currentPage: parseInt(page),
      lastPage: Math.ceil(users.length / perPage),});
  } catch (error) {
    console.log(error)
  }
}

public async userUpdateAdmin({ view, params }: HttpContextContract) {
  const id = params.id;
  const users: any = await UserService.findByIdUser( id );
  return view.render("admin/userUpdatePage", { users });
}
}
