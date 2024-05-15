import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ContactService from "App/Service/contact_service";
import LogService from "App/Service/log_service";
import uploadService from "App/Service/uploads_service";

export default class ContactsController {
  public async contactAdmin({ view, auth }: HttpContextContract) {
    try {
      let contactData: any = await ContactService.findById(1);
      return view.render("admin/contactPage", { data: contactData });
    } catch (error) {
      const { level, message, context } = {
        level: "warn",
        message: "Failed to open admin contact page",
        context: {
          userId: auth.user?.id
        }
      };
      await LogService.create(level, message, context);
      error = "Failed to open admin contact page"
      return view.render('error', { error })
    }
  }

  async create({ request, response, view }: HttpContextContract) {
    try {
      let contactData: any = await ContactService.findById(1);
      const contact = request.only([
        "map",
        "location_title",
        "location_detail",
        "img_line",
        "ink_facebook",
        "ink_line",
      ]);
      const File = request.file("imagefile1", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const fileName1 = await uploadService.upload(File);
      if (File) {
        await uploadService.deleteFile(contact.img_line);
        contact.img_line = `/uploads/${fileName1}`;
      }

      if (contactData != 0) {
        await ContactService.update(1, contact);
        return response.redirect().back();
      }

      await ContactService.create(contact);
      return response.redirect("back");
    } catch (error) {
      const { level, message, context } = {
        level: "warn",
        message: "Failed to add contact page data",
        context: {
          img1: request.file("imagefile1", {
            size: "2mb",
            extnames: ["jpg", "png", "gif"],
          }),
          map: request.input('map'),
          location_title: request.input('location_title'),
          location_detial: request.input('location_detail'),
          img_line: request.input('img_line'),
          link_fb: request.input('ink_facebook'),
          link_line: request.input('ink_line'),
        }
      };
      await LogService.create(level, message, context);
      error = "Failed to add contact page data"
      return view.render('error', { error })
    }
  }
}
