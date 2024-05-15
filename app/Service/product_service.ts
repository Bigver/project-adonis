import _ from 'lodash'
import Product from "App/Models/Product";
import Cache from '@ioc:Adonis/Addons/Cache'

export default class ProductService {
  public static async all({ filters = {} }: any) {
    let check = true
    if (!filters.keyword || filters.keyword == "") {
      check = false
      filters.keyword = "all"
    }
    const cachedproducts: any = await Cache.remember(`products_${filters.keyword}`, 60, async () => {
      let products: any = Product.query()
      if (check) {
        products = Product.query()
          .where("product_name", "like", `%${filters.keyword}%`)
          .orWhere("id", "like", `%${filters.keyword}%`)
      }
      return products
    })
    return cachedproducts
  }
  public static async findById($id: any) {
    const cachedProduct = await Cache.remember('product', 60, async () => {
      const product: any = await Product.find($id)
      return product.toJSON()
    })
    return cachedProduct
  }


  static async createProduct(data: any) {
    await Cache.forget('products_all')
    const product: any = await Product.create(data)
    return product
  }

  static async updateProduct($id, data: any) {
    await Cache.forget('products_all')
    await Cache.forget('product')

    const product = await Product.findOrFail($id)
    product.merge(data)
    return await product.save()

  }

  static async delete(id: any) {
    await Cache.forget('products_all')
    const item = await Product.findOrFail(id)
    return await item.delete()
  }



}