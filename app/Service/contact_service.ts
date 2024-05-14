import Contact from 'App/Models/Contact'
import _ from 'lodash'
import Cache from '@ioc:Adonis/Addons/Cache'

export default class ContactService {
    public static async findById($id) {
      const cachedUsers = await Cache.remember('contact', 60, async () => {
        // ถ้าไม่มีข้อมูลใน Cache ให้ดึงข้อมูลจาก MySQL
        const contact : any = await Contact.find($id)
        // จัดเก็บข้อมูลใน Cache
        return contact.toJSON()
      })
      return cachedUsers
      }
      
      public static async create(data: any) {
        await Cache.forget('contact')
        const contact = await Contact.create(data)
        return contact
      }
      

      public static async update(id : any , data : any){
        await Cache.forget('contact')
        const contact = await Contact.find(id)
        return await contact?.merge(data).save()
        
    }
      
      // public static async delete(id: any) {
      //   const contact = await Contact.findOrFail(id)
      //   return await contact.delete()
      // }
}