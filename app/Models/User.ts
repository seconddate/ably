import { DateTime } from 'luxon'
import { BaseModel, afterCreate, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Event from '@ioc:Adonis/Core/Event'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public email: string

  @column()
  public nickname: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public tel: string

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @afterCreate()
  public static async sendCreateMail (user: User) {
    await Event.emit('register:user', user)
  }
}
