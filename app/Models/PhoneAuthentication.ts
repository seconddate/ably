import { DateTime } from 'luxon'
import { afterCreate, BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { generator } from 'rand-token'
import Event from '@ioc:Adonis/Core/Event'

/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneAuthentication:
 *       type: object
 *       description: 핸드폰 인증
 *       properties:
 *         id:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성일
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정일
 *         expiredAt:
 *           type: string
 *           format: date-time
 *           description: 인증번호 만료일자
 *         userId:
 *           type: integer | null
 *           description: 회원 ID
 *         phoneNumber:
 *           type: string
 *           description: 핸드폰 번호
 *         email:
 *           type: string
 *           description: 이메일
 *         verificationCode:
 *           type: string
 *           description: 인증코드
 */
export default class PhoneAuthentication extends BaseModel {
  public static table = 'phone_authentication'
  public static tablePrimaryKey = 'phone_authentication.id'
  public static userForeignKey = 'phone_authentication.user_id'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at', serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at', serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @column.dateTime({ columnName: 'expired_at', serializeAs: 'expiredAt' })
  public expiredAt: DateTime | null

  @column({ columnName: 'user_id', serializeAs: 'userId' })
  public userId: number | null

  @column({
    columnName: 'phone_number', serializeAs: 'phoneNumber',
    prepare: (value: string) => value ? value.replace(/-/gim, '') : null,
    consume: (value: string) => value ? value.replace(/-/gim, '') : null,
  })
  public phoneNumber: string

  @column()
  public email: string

  @column({ columnName: 'verification_code', serializeAs: null })
  public verificationCode: string

  @beforeCreate()
  public static async setVerificationCode (phoneAuthentication: PhoneAuthentication) {
    if(!phoneAuthentication.$dirty.verificationCode) {
      phoneAuthentication.verificationCode = generator({ chars: 'numeric' }).generate(6)
    }
  }

  @afterCreate()
  public static async sendCreateSms (phoneAuthentication: PhoneAuthentication) {
    await Event.emit('sendPhoneAuthentication:phoneAuthentication', phoneAuthentication)
  }
}
