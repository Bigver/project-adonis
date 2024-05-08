import Interesting from 'App/Models/Interesting'
import _ from 'lodash'


export default class interestingsService {
    public static all({ filters = {} }: any) {
       
          const item = Interesting.query()
            if (_.result(filters, 'id')) {
                item.where('id', filters.id)
            }
    return item
    }

    public static async searchinteresting(keyword : any , page : any) {
        const interesting = await Interesting.query()
        .where('title', 'like', `%${keyword}%`)
        .orWhere('id', 'like', `%${keyword}%`).paginate(page)
        return interesting;
      }
        

  

    static async create(data: any) {
        try {
            const item = await Interesting.create(data)
            return item
        } catch (error) {
            throw new Error('Failed to create interestings')
        }

    }

    static async update(id: number, data: any) {
        try {   
          const interesting = await Interesting.findOrFail(id)
            interesting.merge(data)
            await interesting.save()
        } catch (error) {
            console.log(error);
            return
          throw new Error('Failed to update interesting')
        }
    }
    
  static async delete(id: any) {
    const item = await Interesting.findOrFail(id)
    return await item.delete()
  }

  public static async getShowNews() {
    return await Interesting.query().where('status', 'show').exec();
}
public static async findById(id: number) {
    try {
        const interestings = await Interesting.findOrFail(id);
        return interestings;
    } catch (error) {
        throw new Error('News not found');
    }
}

}

