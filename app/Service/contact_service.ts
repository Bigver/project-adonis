import Contact from 'App/Models/Contact'
import _ from 'lodash'

export default class ContactService {
    public static async all({ filters = {} }: any) {
        const contacts = Contact.query()
      
        if (_.result(filters, 'id')) {
          contacts.where('id', filters.id)
        }
      
        return contacts
      }
      
      public static async create(data: any) {
        const contact = await Contact.create(data)
        return contact
      }
      

      public static async update(id : any , data : any){
        const contact = await Contact.find(id)
        return await contact?.merge(data).save()
        
    }
      
      public static async delete(id: any) {
        const contact = await Contact.findOrFail(id)
        return await contact.delete()
      }
}