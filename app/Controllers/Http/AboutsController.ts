import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AboutService from "App/Service/about_service";
import LogService from "App/Service/log_service";
import uploadService from "App/Service/uploads_service";

export default class AboutsController {
  public async aboutAdmin({ view }: HttpContextContract) {
    try {
      let aboutData: any = await AboutService.findById(1);
      return view.render("admin/aboutPage", { data: aboutData });
    } catch (error) {

      const message = error.message || JSON.stringify(error);
      const level = "warn"

      LogService.create(level, message);
      error = "Failed to open admin about page"
      return view.render('error', { error })
    }
  }

  async create({ request, response, view }: HttpContextContract) {
    try {
      let aboutData: any = await AboutService.findById(1);

      let about = request.only(["img1", "img2", "img3", "title", "detail"]);

      const File1 = request.file("imagefile1", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const File2 = request.file("imagefile2", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const File3 = request.file("imagefile3", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });

      const fileName1 = await uploadService.upload(File1);
      const fileName2 = await uploadService.upload(File2);
      const fileName3 = await uploadService.upload(File3);

      if (File1) {
        await uploadService.deleteFile(aboutData.img1);
        about.img1 = `/uploads/${fileName1}`;
      }
      if (File2) {
        await uploadService.deleteFile(aboutData.img2);
        about.img2 = `/uploads/${fileName2}`;
      }
      if (File3) {
        await uploadService.deleteFile(aboutData.img3);
        about.img3 = `/uploads/${fileName3}`;
      }

      if (aboutData.length != 0) {
        await AboutService.updateAbout(1, about);
        return response.redirect("back");
      }
      await AboutService.createAbout(about);
      return response.redirect("back");
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"

      await LogService.create(level, message);
      error = "Failed to add about page data"
      return view.render('error', { error })
    }
  }

}
