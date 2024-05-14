import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ContactService from "App/Service/contact_service";
import uploadService from "App/Service/uploads_service";

export default class ContactsController {
  public async contactAdmin({ view }: HttpContextContract) {
    let contactData: any = await ContactService.findById(1);
    return view.render("admin/contactPage", { data: contactData });
  }

  async create({ request, response }: HttpContextContract) {
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

      return;

      await ContactService.create(contact);
      return response.redirect("back");
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to create contact" });
    }
  }
}
