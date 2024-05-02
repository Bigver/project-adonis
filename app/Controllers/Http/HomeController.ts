import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HomeService from 'App/Service/home_service'

export default class HomeController {


      async add({ request, response }: HttpContextContract) {
        try {
          const homeData = request.only([
            'keyvisual_img_url',
            'slideshow1_img_url',
            'slideshow1_video_url',
            'slideshow2_img_url',
            'slideshow2_video_url',
            'slideshow3_img_url',
            'slideshow3_video_url',
            'home_messages'])
          await HomeService.create(homeData)
          // console.log(homeData)
          return response.redirect().back()
        } catch (error) {
          console.error(error)
          return response.status(500).json({ error: 'Failed to create Home' })
        }
      }


    async delete({ response, params }: HttpContextContract) {
        await HomeService.delete(params.id)
        return response.redirect().back()
    }
    
    async toggleStatus({ response, params }: HttpContextContract) {
      await HomeService.toggleStatus(params.id)
      return response.redirect().back()
  }
}
