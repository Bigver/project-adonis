import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckPasswordUpdate {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user && auth.user.loginMethod !== 'normal' && auth.user.passwordUpdated === false) {
      return response.redirect().toRoute('social.update.page')
    }

    await next()
  }
}
