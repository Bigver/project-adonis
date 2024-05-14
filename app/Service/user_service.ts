import User from "App/Models/User";
import _ from "lodash";
import Cache from '@ioc:Adonis/Addons/Cache'


export default class UserService {
  public static async all({ filters = {} }: any) {
    let check = true
    if(!filters.keyword || filters.keyword == ""){
      check = false
      filters.keyword = "all"
    }
    const cachedUsers : any = await Cache.remember(`users_${filters.keyword}`, 60, async () => {
      let users : any =  User.query()
      if (check){
        users
        .where("username", "like", `%${filters.keyword}%`)
        .orWhere("id", "like", `%${filters.keyword}%`)
        .orWhere("email", "like", `%${filters.keyword}%`)
      }
      return users
    })
    return cachedUsers
  }

  public static async findByIdUser($id){
    const cachedUsers = await Cache.remember('user', 60, async () => {
      const user : any = await User.find($id)
      return user.toJSON()
    })
    return cachedUsers
  }

  public static async createUser(data: any) {
    await Cache.forget('users_all')
    const user = await User.create(data);
    return user;
  }

  public static async login(email: any) {
    const user = await User.query().where("email", email).firstOrFail();
    return user.serialize();
  }

  public static async updateUser(id: any, data: any, access: any) {
    await Cache.forget('users_all')
    await Cache.forget('user')

    data.access = access;
    data.id = parseInt(id)

    const user = await User.find(id);
    return await user?.merge(data).save();
    }

  public static async updateProfile(id: any, data: any) {
    await Cache.forget('user')
    const user = await User.find(id);
    return await user?.merge(data).save();
  }

  public static async delete(id: any) {
    await Cache.forget('users_all')
    const item = await User.findOrFail(id);
    return await item.delete();
  }

}
