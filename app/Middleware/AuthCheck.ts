import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


export default class AuthCheck {
  public async handle({ view , auth , response}: HttpContextContract, next: () => Promise<void>) {
    let authCheck = auth.user?.serialize()
    let role :any
    let accessData :any
  
    if (authCheck) {
      role = authCheck.role
      if (role != 'admin'){
        return response.redirect('/login')
      }
      if (authCheck.access){
        accessData =  JSON.parse(authCheck.access)
        view.share({ access : accessData[0] })     
      } else{
        accessData = {
          "userAdmin" : "no",
          "checkAdmin" : "no",
          "PageAdmin" : "no"
        }
        view.share({ access : accessData})     
      }
    }


    await next()
  }

}



