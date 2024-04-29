import About from 'App/Models/About'
import _ from 'lodash'


export default class AboutService {
  public static async all({filters = {}} : any){
    const about = About.query()
    if(_.result(filters,'id')){
      about.where('id',filters.id)
    }
    return about
  }
    

  
public static async createAbout(data : any){
    const about = await About.create(data)
    return about
    }


public static async updateAbout(id : any , data : any){
    const about = await About.find(id)
    return await about?.merge(data).save()
    
}

}