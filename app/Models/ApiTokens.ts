import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ApiTokens extends BaseModel {
  public static table = 'api_tokens'
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at', serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ columnName: 'expires_at', serializeAs: 'expiresAt' })
  public expiresAt: DateTime

  @column({ columnName: 'user_id', serializeAs: 'userId' })
  public userId: number

  @column({ columnName: 'name' })
  public name: string

  @column({ columnName: 'type' })
  public type: string

  @column({ columnName: 'token' })
  public token: string
}
