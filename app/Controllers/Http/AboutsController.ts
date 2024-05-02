import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AboutService from 'App/Service/about_service';

export default class AboutsController {
    async create({ request, response }: HttpContextContract) {
        const filter = {
            id: 1
        };
        try {
          let aboutData: any = await AboutService.all({ filters: filter })
          console.log(aboutData)
          if (aboutData){
            aboutData =aboutData[0].serialize() 
          }
          const about = request.only(["img1", "img2", "img3", "title","detail"]);
          if (aboutData){
            await  AboutService.updateAbout(1 , about);
            return response.redirect("back");
          }
          await  AboutService.createAbout(about);
          return response.redirect("back");
        } catch (error) {
          console.error(error);
          return response.status(500).json({ error: "Failed to create about" });
        }
      }
    
}
