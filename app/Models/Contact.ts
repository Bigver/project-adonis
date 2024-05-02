import { DateTime } from 'luxon'

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public map: string

  @column()
  public location_title: string

  @column()
  public location_detail: string

  @column()
  public img_line: string
  
  @column()
  public ink_facebook: string

  @column()
  public ink_line: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
