import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContactService from 'App/Service/contact_service';
import uploadService from 'App/Service/uploads_service';

export default class ContactsController {
    async create({ request, response }: HttpContextContract) {
        const filter = {
            id: 1
        };
        try {
          let aboutData: any = await ContactService.all({ filters: filter })
          if (aboutData != 0){
            aboutData =aboutData[0].serialize() 
          }
          const about = request.only(["map", "location_title", "location_detail", "img_line","ink_facebook","ink_line"]);
          const File = request.file("imagefile1", {size: '2mb',extnames: ['jpg', 'png', 'gif'],});
          const fileName1 = await uploadService.upload(File)

          if (File){
            await uploadService.deleteFile(about.img_line)
            about.img_line = `/uploads/${fileName1}`;;
          }


          if (aboutData != 0){
            await  ContactService.update(1 , about);
            return response.redirect("back");
          }
          await  ContactService.create(about);
          return response.redirect("back");
        } catch (error) {
          console.error(error);
          return response.status(500).json({ error: "Failed to create about" });
        }
      }
    
}