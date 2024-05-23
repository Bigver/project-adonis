import About from "App/Models/About";
import _ from "lodash";
import Cache from '@ioc:Adonis/Addons/Cache'

export default class AboutService {
  public static async findById(id : number){
    const cachedUsers = await Cache.remember(`about:${id}`, 60, async () => {
      // ถ้าไม่มีข้อมูลใน Cache ให้ดึงข้อมูลจาก MySQL
      const about : any = await About.find(id)
      // จัดเก็บข้อมูลใน Cache
      return about.serialize()
    })
    return cachedUsers
  }

  public static async createAbout(data: any) {
    const about = await About.create(data);
    return about.serialize();
  }

  public static async updateAbout(id: number, data: any) {
    await Cache.forget(`about:${id}`)
    const about = await About.find(id);
    return await about?.merge(data).save();
  }
}
