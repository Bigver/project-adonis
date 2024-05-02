import Home from 'App/Models/Home'
import _ from 'lodash'


export default class HomeService {


       public static  all({filters = {}} : any) {
        const home = Home.query()
        if (_.result(filters, 'id')) {
          home.where('id', filters.id)
        }
        return home
       }

      static async create(data: any) {
        const home = await Home.create(data)
        return home
      }

      static async delete(id: any) {
        const home = await Home.findOrFail(id)
        return await home.delete() 
      }


      static async toggleStatus(id:any) {
        const home = await Home.findOrFail(id)
        switch (home.status) {
          case 'hide':
            home.status = 'show'
            home.save();
              return home;
          case 'show':
            home.status = 'hide'
            home.save();
              return home;
          default:
              return home;
      }
    }

    public static async createHome(data : any){
      const home = await Home.create(data)
      return home
      }
  
  
  public static async updateHome(id : any , data : any){
      const home = await Home.find(id)
      return await home?.merge(data).save()
      
  }
    

}