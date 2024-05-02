import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import UserService from "App/Service/user_service";
import { schema, rules } from '@ioc:Adonis/Core/Validator'
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
      await User.create(payload);
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

  async destroy({response , params} : HttpContextContract){
    await UserService.delete(params.id)
    return response.redirect('back')
}

  async login({ request, response, auth , session }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    
    try {     
      const user = await User.query().where("email", email).firstOrFail();
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
      console.log(error)
      return response.redirect().back()
    }
  }

  async logout( { response  , auth} :HttpContextContract){   
    await auth.use('web').logout()
    return response.redirect().toRoute('page.login')
}
}
