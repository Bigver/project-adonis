import User from 'App/Models/User'
import _ from 'lodash'


export default class UserService {
  public static async all({filters = {}} : any){
    const user = User.query()
    if(_.result(filters,'id')){
      user.where('id',filters.id)
    }
    return user
  }
    

  
public static async createUser(data : any){
    const user = await User.create(data)
    console.log(user)
    return user
    }


public static async updateUser(id : any , data : any , access : any){
    data.access = access
    const user = await User.find(id)
    return await user?.merge(data).save()
    
}

public static async updateProfile(id : any , data : any){
  const user = await User.find(id)
  return await user?.merge(data).save()
  
}


public static async delete(id : any){
  const item = await User.findOrFail(id)
  return await item.delete()
}



// public static async login(email : any , password : any , session : any) {
//     const user = await User.findBy('email', email)
//     if (!user) {
//       return  console.log("User ไม่ถูก")
//     }
//     await hash.verify(user.password, password)
//     if (!user.password) {
//       return console.log("password ไม่ถูก")
//     }
//     await User.verifyCredentials(email, password)
//     session.put('user', user.toJSON())
//     return user
//   } 
  
}