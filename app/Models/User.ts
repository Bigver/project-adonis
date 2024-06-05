import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string


  @column()
  public email: string

  @column()
  public password: string

  @column()
  public access: string | null


  @column()
  public rememberMeToken: string | null

  @column()
  declare role: 'admin' | 'user'

  @column()
  public loginMethod: 'normal' | 'facebook' | 'google' | 'twitter'

  @column()
  public passwordUpdated: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
