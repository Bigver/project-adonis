import About from "App/Models/About";
import _ from "lodash";
import Cache from '@ioc:Adonis/Addons/Cache'

export default class AboutService {
  public static async findById($id){
    const cachedUsers = await Cache.remember('about', 60, async () => {
      // ถ้าไม่มีข้อมูลใน Cache ให้ดึงข้อมูลจาก MySQL
      const about : any = await About.find($id)
      // จัดเก็บข้อมูลใน Cache
      return about.toJSON()
    })
    return cachedUsers
  }

  public static async createAbout(data: any) {
    await Cache.forget('about')
    const about = await About.create(data);
    return about.serialize();
  }

  public static async updateAbout(id: any, data: any) {
    await Cache.forget('about')
    const about = await About.find(id);
    return await about?.merge(data).save();
  }
}
