import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import interestingsService from 'App/Service/interestings_service';
import uploadService from 'App/Service/uploads_service';
export default class InterestingsController {
    async add({ request, response }:HttpContextContract) {
        try {
            const data = request.only(['title', 'description', 'imgUrl', 'content'])
            const File = request.file("imagefile1", {size: '2mb',extnames: ['jpg', 'png', 'gif'],});
            const fileName1 = await uploadService.upload(File)

            if (File){
                await uploadService.deleteFile(data.imgUrl)
                data.imgUrl = `${fileName1}`;
              }
            await interestingsService.create(data);
            return response.redirect().back();
        } catch (error) {
            //console.error(error);
            
            return response.status(500).json({ error: 'Failed to add Interestings' });
        }
    }
    
  async UpdateInteresting({ params, request, response }: HttpContextContract) {
    try {
      const { id } = params;
      const data = request.only(['title', 'description', 'imgUrl', 'content'])
      const File = request.file("imagefile1", {size: '2mb',extnames: ['jpg', 'png', 'gif'],});
            const fileName1 = await uploadService.upload(File)

            if (File){
                await uploadService.deleteFile(data.imgUrl)
                data.imgUrl = `${fileName1}`;
              }
      await interestingsService.update(id, data);
      return response.redirect().toRoute('showInteresting')
    } catch (error) {
      return response.badRequest(error.message);
    }
  }
  async editInteresting({ params, view }: HttpContextContract) {
    const Interestings = await interestingsService.all({ filters: { id: params.id } })
    const Interesting = Interestings[0]
    const inter = Interesting.serialize()
    return view.render('admin/UpdateInterestingPage', { inter })
  }
  
  async deleteInteresting({ response, params }: HttpContextContract) {
    await interestingsService.delete(params.id)
    return response.redirect('back')
  }
  public async toggleStatus({ params, response }: HttpContextContract) {
    try {
        const { id } = params;
        const interestings = await interestingsService.findById(id);

        if (!interestings) {
            return response.status(404).json({ error: 'News not found' });
        }

        interestings.status = interestings.status === 'show' ? 'hide' : 'show';
        await interestings.save();
        return response.redirect().back();
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Failed to toggle news status' });
    }
}

}
    
