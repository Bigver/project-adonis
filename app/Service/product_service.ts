import _ from 'lodash'
import Product from "App/Models/Product";
import Cache from '@ioc:Adonis/Addons/Cache'

export default class ProductService {
  public static async all({ filters = {} }: any) {
    let check = true
    if(!filters.keyword || filters.keyword == ""){
      check = false
      filters.keyword = "all"
    }
    let products : any =  Product.query({connection : 'mysqlRead'})
    if (check){
      products = Product.query()
      .where("product_name", "like", `%${filters.keyword}%`)
      .orWhere("id", "like", `%${filters.keyword}%`)
    }
    return products
    }
  
  public static async findById(id : number) {
    const cachedProduct = await Cache.remember(`product:${id}`, 60, async () => {
      const product : any = await Product.find(id)
      return product.toJSON()
    })
    return cachedProduct
  }


  static async createProduct(data: any) {
    const product : any= await Product.create(data)
    return product
  }

  static async updateProduct(id : number, data: any) {
    await Cache.forget(`product:${id}`)
    const product = await Product.findOrFail(id)
    product.merge(data)
    return await product.save()
    
  }
  
  static async delete(id: any) {
    const item = await Product.findOrFail(id)
    return await item.delete()
  }

  

}