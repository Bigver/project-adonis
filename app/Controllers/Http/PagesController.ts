import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

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
    return view.render("admin/dashBoard");
  }

  public async errorPage({ view }: HttpContextContract) {
    return view.render("admin/error");
  }

  public async profilePage({ view }: HttpContextContract) {
    return view.render("admin/userProfile");
  }
}
