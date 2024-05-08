import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AboutService from "App/Service/about_service";
import uploadService from "App/Service/uploads_service";


export default class AboutsController {
  async create({ request, response }: HttpContextContract) {
    const filter = {
      id: 1,
    };
   
    try {
     

      let aboutData: any = await AboutService.all({ filters: filter });
     
      let about = request.only(["img1", "img2", "img3", "title", "detail"]);
      if (aboutData.length != 0) {
        aboutData = aboutData[0].serialize();
      }
      const File1 = request.file("imagefile1", {size: '2mb',extnames: ['jpg', 'png', 'gif'],});
      const File2 = request.file("imagefile2", {size: '2mb',extnames: ['jpg', 'png', 'gif'],});
      const File3 = request.file("imagefile3", {size: '2mb',extnames: ['jpg', 'png', 'gif'],});
      
     
      const fileName1 = await uploadService.upload(File1)
      const fileName2 = await uploadService.upload(File2)
      const fileName3 = await uploadService.upload(File3)

    
      if (File1){
        await uploadService.deleteFile(aboutData.img1)
        about.img1 = `/uploads/${fileName1}`;
      }
      if (File2){
        await uploadService.deleteFile(aboutData.img2)
        about.img2 = `/uploads/${fileName2}`;
      }
      if (File3){
        await uploadService.deleteFile(aboutData.img3)
        about.img3 = `/uploads/${fileName3}`;
      }
      
      

      if (aboutData.length != 0) {
        await AboutService.updateAbout(1, about);
        return response.redirect("back");
      }
      await AboutService.createAbout(about);
      return response.redirect("back");
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to create about" });
    }
  }
}
