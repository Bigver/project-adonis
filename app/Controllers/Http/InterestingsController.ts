import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UrlService from "App/Service/get_url_service";
import interestingsService from "App/Service/interestings_service";
import uploadService from "App/Service/uploads_service";
export default class InterestingsController {
  public async showInteresting({ view, request }: HttpContextContract) {
    try {
      const filter: any = {};
      let page = request.input("page", 1); // รับค่าหน้าปัจจุบันจาก request
      const limit = 2; // จำนวนรายการต่อหน้า
      page = Math.max(page, 1);
      let interestings: any;
      const keyword = request.input("keyword");
      let interestingsPaginator: any;

      filter.keyword = keyword;

      interestingsPaginator = await interestingsService
        .all({ filter: filter })
        .paginate(page, limit);

      interestings = interestingsPaginator.serialize();
      const paginationLinks = await UrlService.getUrlsForRange(
        1,
        interestingsPaginator.lastPage
      );
      return view.render("admin/interestingListPage", {
        items: interestings,
        pagination: interestingsPaginator,
        paginationLinks,
        keyword,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async UpdateinterestingPage({ view }: HttpContextContract) {
    return view.render("admin/interestingUpdatePage");
  }

  public async interestingAdmin({ view }: HttpContextContract) {
    return view.render("admin/interestingPage");
  }

  

  async add({ request, response }: HttpContextContract) {
    try {
      const data = request.only(["title", "description", "imgUrl", "content"]);
      const File = request.file("imagefile1", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const fileName1 = await uploadService.upload(File);

      if (File) {
        await uploadService.deleteFile(data.imgUrl);
        data.imgUrl = `${fileName1}`;
      }
      await interestingsService.create(data);
      return response.redirect().back();
    } catch (error) {
      //console.error(error);

      return response.status(500).json({ error: "Failed to add Interestings" });
    }
  }

  async UpdateInteresting({ params, request, response }: HttpContextContract) {
    try {
      const { id } = params;
      const data = request.only(["title", "description", "imgUrl", "content"]);
      const File = request.file("imagefile1", {
        size: "2mb",
        extnames: ["jpg", "png", "gif"],
      });
      const fileName1 = await uploadService.upload(File);

      if (File) {
        await uploadService.deleteFile(data.imgUrl);
        data.imgUrl = `${fileName1}`;
      }
      await interestingsService.update(id, data);
      return response.redirect().toRoute("showInteresting");
    } catch (error) {
      return response.badRequest(error.message);
    }
  }
  async editInteresting({ params, view }: HttpContextContract) {
    const Interestings = await interestingsService.all({
      filters: { id: params.id },
    });
    const Interesting = Interestings[0];
    const inter = Interesting.serialize();
    return view.render("admin/UpdateInterestingPage", { inter });
  }

  async deleteInteresting({ response, params }: HttpContextContract) {
    await interestingsService.delete(params.id);
    return response.redirect("back");
  }
  public async toggleStatus({ params, response }: HttpContextContract) {
    try {
      const { id } = params;
      const interestings = await interestingsService.findById(id);

      if (!interestings) {
        return response.status(404).json({ error: "News not found" });
      }

      interestings.status = interestings.status === "show" ? "hide" : "show";
      await interestings.save();
      return response.redirect().back();
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ error: "Failed to toggle news status" });
    }
  }
}
