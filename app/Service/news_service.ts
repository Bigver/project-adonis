import News from "App/Models/News";
import _ from 'lodash'


export default class NewsService {
    public static all({ filters = {} }: any) {
        const item = News.query()
        if (_.result(filters, 'id')) {
            item.where('id', filters.id)
        }

        return item
    }

    public static async searchNews(keyword : any , page : any) {
        const newsPaginator = await News.query()
        .where('title', 'like', `%${keyword}%`)
        .orWhere('id', 'like', `%${keyword}%`).paginate(page)
        return newsPaginator;
      }
        

    static async create(data: any) {
        try {
            const item = await News.create(data)
            return item
        } catch (error) {
            // const data = {
            //     error : error,
            //     file : "",
            //     path : "",

            // }

            // LogService.create(data)
            //throw new Error('Failed to create news')
        }

    }


    static async update(id: number, data: any) {
        try {
            const news = await News.findOrFail(id)
            news.merge(data)
            await news.save()
            return news
        } catch (error) {
            throw new Error('Failed to update news')
        }
    }

    public static async findById(id: number) {
        try {
            const news = await News.findOrFail(id);
            return news;
        } catch (error) {
            throw new Error('News not found');
        }
    }

    public static async getShowNews() {
        return await News.query().where('status', 'show').orderBy('updatedAt', "desc").exec();
    }

    static async delete(id: any) {
        const item = await News.findOrFail(id)
        return await item.delete()
    }

}