import _ from 'lodash'
import Product from "App/Models/Product";

export default class ProductService {

  public static all({ filters = {} }: any) {
       
    const item = Product.query()
      if (_.result(filters, 'id')) {
          item.where('id', filters.id)
      }
      return item
     }

  static async createProduct(data: any) {
    const product = await Product.create(data)
    return product
  }

  static async updateProduct(id: number, productData: any) {
    try {
      const product = await Product.findOrFail(id)
      product.merge(productData)
      await product.save()
    } catch (error) {
      throw new Error('Failed to update user')
    }
  }

  static async delete(id: any) {
    const item = await Product.findOrFail(id)
    return await item.delete()
  }

}