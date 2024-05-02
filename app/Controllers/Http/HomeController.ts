import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HomeService from 'App/Service/home_service'

export default class HomeController {

      async update({ request, response }: HttpContextContract) {
        const filter = {
            id: 1
        };
        try {
          let homeData: any = await HomeService.all({ filters: filter })
          console.log(homeData)
          if (homeData.length != 0){
            homeData =homeData[0].serialize() 
          }
          const home = request.only([
            "keyvisual_img_url", 
            "slideshow1_img_url", 
            "slideshow1_video_url", 
            "slideshow2_img_url", 
            "slideshow2_video_url", 
            "slideshow3_img_url", 
            "slideshow3_video_url", 
            "home_messages"]);

          if (homeData.length != 0){
            await  HomeService.updateHome(1 , home);
            return response.redirect("back");
          }
          await  HomeService.createHome(home);
          return response.redirect("back");
        } catch (error) {
          console.error(error);
          return response.status(500).json({ error: "Failed to update Home" });
        }
      }
    
}