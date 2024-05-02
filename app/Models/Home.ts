import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Home extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public keyvisual_img_url: string

  @column()
  public slideshow1_img_url: string

  @column()
  public slideshow2_img_url: string

  @column()
  public slideshow3_img_url: string

  @column()
  public slideshow1_video_url: string
  
  @column()
  public slideshow2_video_url: string

  @column()
  public slideshow3_video_url: string

  @column()
  public home_messages: string

  @column()
  public status: 'show' | 'hide'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
