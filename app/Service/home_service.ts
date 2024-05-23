import Home from "App/Models/Home";
import _ from "lodash";
import Cache from '@ioc:Adonis/Addons/Cache'

export default class HomeService {
  public static async findById(id : number){
    const cachedUsers = await Cache.remember(`home:${id}`, 60, async () => {
      // ถ้าไม่มีข้อมูลใน Cache ให้ดึงข้อมูลจาก MySQL
      const home : any = await Home.find(id)
      // จัดเก็บข้อมูลใน Cache
      return home.serialize()
    })
    return cachedUsers
  }

  static async create(data: any) {
    const home = await Home.create(data);
    return home;
  }

  static async toggleStatus(id: any) {
    const home = await Home.findOrFail(id);
    switch (home.status) {
      case "hide":
        home.status = "show";
        home.save();
        return home;
      case "show":
        home.status = "hide";
        home.save();
        return home;
      default:
        return home;
    }
  }

  public static async createHome(data: any) {
    const home = await Home.create(data);
    return home;
  }

  public static async updateHome(id: number, data: any) {
    await Cache.forget(`home:${id}`)
    const home = await Home.find(id);
    return await home?.merge(data).save();
  }
}
