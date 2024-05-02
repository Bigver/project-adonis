import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NewsService from 'App/Service/NewsService';


export default class NewsController {


    async add({ request, response }: HttpContextContract) {
        try {
            const data = request.only(['title', 'description', 'imgUrl', 'content'])
            await NewsService.create(data);
            return response.redirect().back();
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Failed to add News' });
        }
    }

    async update({ params, request, response }: HttpContextContract) {
        try {
            const { id } = params;
            const data = request.only(['title', 'description', 'imgUrl', 'content']);
            await NewsService.update(id, data);
            return response.redirect().toRoute('news.update.list')
        } catch (error) {
            response.badRequest(error.message);
        }
    }

    public async toggleStatus({ params, response }: HttpContextContract) {
        try {
            const { id } = params;
            const news = await NewsService.findById(id);

            if (!news) {
                return response.status(404).json({ error: 'News not found' });
            }

            news.status = news.status === 'show' ? 'hide' : 'show';
            await news.save();
            return response.redirect().back();
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Failed to toggle news status' });
        }
    }

    async delete({ response, params }: HttpContextContract) {
        await NewsService.delete(params.id)
        return response.redirect().toRoute('news.update.list')
    }

}
