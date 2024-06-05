import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


export default class AuthCheck {
  public async handle({ view, auth, response }: HttpContextContract, next: () => Promise<void>) {
    let authCheck = auth.user?.serialize()
    let role: any
    let accessData: any
    let check: any // socialUpdate
    let social: any

    if (authCheck) {
      role = authCheck.role
      check = authCheck.password_updated
      social = authCheck.login_method
      if (role != 'admin') {
        return response.redirect('/login')
      } if (check != 1 && social != 'normal') {
        return response.redirect().toRoute('social.update.page')
      }
      if (authCheck.access) {
        accessData = JSON.parse(authCheck.access)
        view.share({ access: accessData[0] })
      } else {
        accessData = {
          "userAdmin": "no",
          "checkAdmin": "no",
          "PageAdmin": "no"
        }
        view.share({ access: accessData })
      }
    }


    await next()
  }

}



