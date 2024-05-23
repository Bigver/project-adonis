import User from "App/Models/User";
import _ from "lodash";
import Cache from '@ioc:Adonis/Addons/Cache'


export default class UserService {
  public static async all({ filters = {} }: any) {
    let check = true
    if(!filters.keyword || filters.keyword == ""){
      check = false
    }
    // connection : 'read'
    let users : any =  User.query({connection : 'mysqlRead'})
    if (check){
      users
      .where("username", "like", `%${filters.keyword}%`)
      .orWhere("id", "like", `%${filters.keyword}%`)
      .orWhere("email", "like", `%${filters.keyword}%`)
    }
    return users
  }
6
  public static async findByIdUser(id : Number){
    const cachedUsers = await Cache.remember(`user:${id}`, 60, async () => {
      const user : any = await User.find(id)
      return user.serialize()
    })
    return cachedUsers
  }

  public static async createUser(data: any) {
    const user = await User.create(data);
    return user;
  }

  public static async login(email: any) {
    const user = await User.query().where("email", email).firstOrFail();
    return user.serialize();
  }

  public static async updateUser(id: any, data: any, access: any) {
    await Cache.forget(`user:${id}`)

    data.access = access;
    data.id = parseInt(id)
    const user = await User.find(id);
    return await user?.merge(data).save();
    }

  public static async updateProfile(id: any, data: any) {
    await Cache.forget(`user:${id}`)
    const user = await User.find(id);
    return await user?.merge(data).save();
  }

  public static async delete(id: any) {
    const item = await User.findOrFail(id);
    return await item.delete();
  }

}
