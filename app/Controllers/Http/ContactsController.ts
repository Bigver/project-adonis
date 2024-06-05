import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ContactService from "App/Service/contact_service";
import LogService from "App/Service/log_service";
import uploadService from "App/Service/uploads_service";

export default class ContactsController {
  public async contactAdmin({ view }: HttpContextContract) {
    try {
      let contactData: any = await ContactService.findById(1);
      return view.render("admin/contactPage", { data: contactData });
    } catch (error) {
      const message = error.message || JSON.stringify(error)
      const level = 'error'

      LogService.create(level, message);
      error = "Fail to get contact admin page"
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
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      LogService.create(level, message);
      error = "Failed to add contact page data"
      return view.render('error', { error })
    }
  }
}
