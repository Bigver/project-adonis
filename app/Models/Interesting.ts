import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Interesting extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare imgUrl: string

  @column()
  declare status: 'show' | 'hide'

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}