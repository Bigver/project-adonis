import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  declare userId: number

  @column()
  declare status: 'pending' | 'processing' | 'shipped' | 'recived'

  @column()
  declare total: number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: "id",
    foreignKey: "userId"
  })
  declare user: BelongsTo<typeof User>


}