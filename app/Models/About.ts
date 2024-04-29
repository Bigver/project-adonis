import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class About extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public img1: string

  @column()
  public img2: string

  @column()
  public img3: string

  @column()
  public title: string

  @column()
  public detail: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
