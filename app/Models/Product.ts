import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  declare product_name: string | null

  @column()
  declare price_product: number

  @column()
  declare img_product : string

  @column()
  declare img2_product : string

  @column()
  declare img3_product : string
  
  @column()
  declare detail_product : string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  cost: number
}
