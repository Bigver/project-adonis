import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Product from './Product'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  declare orderId: number

  @column()
  declare productId: number

  @column()
  declare price: number

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: "id",
    foreignKey: "userId"
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Product, {
    localKey: "id",
    foreignKey: "productId"
  })
  declare product: BelongsTo<typeof Product>
}
