import Interesting from "App/Models/Interesting";
import _ from "lodash";
import Cache from "@ioc:Adonis/Addons/Cache";

export default class interestingsService {
  public static async all({ filters = {} }: any) {
    let check = true
    if (!filters.keyword || filters.keyword == "") {
      check = false
    }

    let item: any = Interesting.query({connection : 'mysqlRead'})
    if (check) {
      item
        .where("title", "like", `%${filters.keyword}%`)
        .orWhere("id", "like", `%${filters.keyword}%`)
    }

    return item;

  }

  static async create(data: any) {
    const item = await Interesting.create(data);
    return item.serialize;

  }

  static async update(id: any, data: any) {
    await Cache.forget(`intersting:${id}`)
    const interesting = await Interesting.find(id);
    return await interesting?.merge(data).save();
  }


  static async delete(id: any) {
    const item = await Interesting.findOrFail(id);
    return await item.delete();
  }

  public static async getShowinterestings() {
    return await Interesting.query().where("status", "show").exec();
  }
  public static async findById(id: number) {
    const cachedInteresting = await Cache.remember(`intersting:${id}`, 60, async () => {
      const interesting: any = await Interesting.find(id)
      return interesting.toJSON()
    })
    return cachedInteresting
  }

  
  static async updateStatus(id: number, data: any) {
    const value = {
      status: data.status
    }
    await Cache.forget(`interestings:${id}`);
    const interestings = await Interesting.find(id);
    return await interestings?.merge(value).save();
  }
}