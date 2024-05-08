import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Cart from './Cart'
import Product from './Product'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cartId: number

  @column()
  public productId: number

  @column()
  declare totalPrice: number

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Cart, {
    localKey: "id",
    foreignKey: "cartId"
  })
  declare cart: BelongsTo<typeof Cart>

  @belongsTo(() => Product, {
    localKey: "id",
    foreignKey: "productId"
  })
  declare product: BelongsTo<typeof Product>

  public static boot() {
    super.boot()
    this.before('save', async (cartItem: CartItem) => {
      const product = await Product.findOrFail(cartItem.productId)
      const totalPrice = cartItem.quantity * product.price_product
      cartItem.totalPrice = totalPrice
    })
  }
}
