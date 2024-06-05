import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import HomeService from "App/Service/home_service";
import LogService from "App/Service/log_service";
import uploadService from "App/Service/uploads_service";

export default class HomeController {
  public async homeAdmin({ view }: HttpContextContract) {
    try {
      let homeData: any = await HomeService.findById(1);
      return view.render("admin/homeAdmin", { home: homeData });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      LogService.create(level, message);
      error = "Failed to add contact page data"
      return view.render('error', { error })
    }
  }

  async update({ request, response, view }: HttpContextContract) {
    try {
      let homeData: any = await HomeService.findById(1);
      const File1 = request.file("imagefile1", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const File2 = request.file("imagefile2", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const File4 = request.file("imagefile4", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });

      const fileName1 = await uploadService.upload(File1);
      const fileName2 = await uploadService.upload(File2);
      const fileName4 = await uploadService.upload(File4);

      const home = request.only([
        "keyvisual_img_url",
        "slideshow1_img_url",
        "slideshow1_video_url",
        "slideshow2_img_url",
        "slideshow2_video_url",
        "slideshow3_img_url",
        "slideshow3_video_url",
        "home_messages",
      ]);

      if (File1) {
        await uploadService.deleteFile(home.keyvisual_img_url);
        home.keyvisual_img_url = `/uploads/${fileName1}`;
      }
      if (File2) {
        await uploadService.deleteFile(home.slideshow1_img_url);
        home.slideshow1_img_url = `/uploads/${fileName2}`;
      }

      if (File4) {
        await uploadService.deleteFile(home.slideshow3_img_url);
        home.slideshow3_img_url = `/uploads/${fileName4}`;
      }

      if (homeData.length != 0) {
        await HomeService.updateHome(1, home);
        return response.redirect("back");
      }
      await HomeService.createHome(home);
      return response.redirect("back");
    }
    catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      LogService.create(level, message);
      error = "Failed to add contact page data"
      return view.render('error', { error })
    }
  }
}



