import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import interestingsService from 'App/Service/interestings_service';
import LogService from 'App/Service/log_service';
import uploadService from 'App/Service/uploads_service';
export default class InterestingsController {

  public async showInteresting({ view, request }: HttpContextContract) {
    try {
      const filters: any = {};
      let page = request.input("page", 1); // รับค่าหน้าปัจจุบันจาก request

      const perPage = 4;
      const keyword = request.input("keyword");
      filters.keyword = keyword;

      const interestings: any = await interestingsService.all({ filters });
      const startIndex = (page - 1) * perPage;
      const endIndex = Math.min(startIndex + perPage, interestings.length);
      const paginatedInterestings = interestings.slice(startIndex, endIndex);

      return view.render("admin/interestingListPage", {
        items: paginatedInterestings,
        pagination: interestings,
        total: interestings.length,
        perPage: perPage,
        currentPage: parseInt(page),
        lastPage: Math.ceil(interestings.length / perPage),
      });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message)
      error = "Failed to open show interesting page"
      return view.render('error', { error })
    }
  }

  public async UpdateinterestingPage({ view }: HttpContextContract) {
    return view.render("admin/interestingUpdatePage");
  }

  public async interestingAdmin({ view }: HttpContextContract) {
    return view.render("admin/interestingPage");
  }

  async add({ view, request, response }: HttpContextContract) {
    try {
      const data = request.only(['title', 'description', 'imgUrl', 'content'])
      const File = request.file("imagefile1", { size: '2mb', extnames: ['jpg', 'png', 'gif'], });
      const fileName1 = await uploadService.upload(File)

      if (File) {
        await uploadService.deleteFile(data.imgUrl)
        data.imgUrl = `${fileName1}`;
      }
      await interestingsService.create(data);
      return response.redirect().back();
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to add data in interesting page"
      return view.render('error', { error })
    }
  }

  async UpdateInteresting({ view, params, request, response }: HttpContextContract) {
    try {
      const { id } = params;
      const data = request.only(['title', 'description', 'imgUrl', 'content'])
      const File = request.file("imagefile1", { size: '2mb', extnames: ['jpg', 'png', 'gif'], });
      const fileName1 = await uploadService.upload(File)

      if (File) {
        await uploadService.deleteFile(data.imgUrl)
        data.imgUrl = `${fileName1}`;
      }
      await interestingsService.update(id, data);
      return response.redirect().toRoute('showInteresting')
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to add data in interesting page"
      return view.render('error', { error })
    }
  }
  async editInteresting({ params, view }: HttpContextContract) {
    try {
      const id = params.id;
      const inter: any = await interestingsService.findById(id);
      return view.render("admin/interestingUpdatePage", { inter });
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"

      await LogService.create(level, message);
      error = "Failed to edit data in interesting page"
      return view.render('error', { error })
    }
  }

  async deleteInteresting({ view, response, params }: HttpContextContract) {
    try {
      await interestingsService.delete(params.id);
      return response.redirect("back");
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to delete page"
      return view.render('error', { error })
    }
  }

  public async toggleStatus({ view, params, response }: HttpContextContract) {
    try {
      const { id } = params;
      const interesting = await interestingsService.findById(id);

      if (!interesting) {
        return response.status(404).json({ error: "Interesting not found" });
      }

      if (interesting.status === "show") {
        interesting.status = "hide";
      }
      else if (interesting.status === "hide") {
        interesting.status = "show";
      }

      await interestingsService.updateStatus(id, interesting);
      return response.redirect().back();
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      const level = "warn"
      await LogService.create(level, message);
      error = "Failed to toggle status page"
      return view.render('error', { error })
    }
  }

}