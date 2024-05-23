import News from "App/Models/News";
import _ from "lodash";
import Cache from "@ioc:Adonis/Addons/Cache";

export default class NewsService {
    public static async all({ filters = {} }: any) {
        let check = true
        if (!filters.keyword || filters.keyword == "") {
            check = false

        }
        let item: any = News.query({connection : 'mysqlRead'})
        if (check) {
            item
                .where("title", "like", `%${filters.keyword}%`)
                .orWhere("id", "like", `%${filters.keyword}%`)
        }

        return item;

    }

    static async create(data: any) {
        const item = await News.create(data);
        return item.serialize();

    }

    public static async findById(id: number) {
        const cachedNews = await Cache.remember(`news:${id}`, 60, async () => {
            const news: any = await News.find(id)
            return news.serialize();
        });
        return cachedNews;
    }

    static async update(id: number, data: any) {
        await Cache.forget(`news:${id}`);
        const news = await News.find(id);
        return await news?.merge(data).save();
    }

    static async updateStatus(id: number, data: any) {
        const value = {
            status: data.status
        }
        await Cache.forget(`news:${id}`);
        const news = await News.find(id);
        return await news?.merge(value).save();
    }

    static async delete(id: any) {
        const item = await News.findOrFail(id);
        return await item.delete();
    }

    public static async getShowNews() {
        return await News.query().where("status", "show").exec();
    }
}