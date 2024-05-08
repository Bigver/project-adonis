import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import CartItem from './CartItem'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: "id",
    foreignKey: "userId"
  })

  declare user: BelongsTo<typeof User>
  @belongsTo(() => CartItem, {
    localKey: "cartId",
    foreignKey: "id"
  })
  declare cartItem: BelongsTo<typeof CartItem>



}
