import { DateTime } from 'luxon'
import { BaseModel, afterCreate, beforeCreate, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Event from '@ioc:Adonis/Core/Event'
import { generator } from 'rand-token'

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: 회원
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
 *         lastLoginedAt:
 *           type: string | null
 *           format: date-time
 *           description: 마지막 로그인 시간
 *         telVerifiedAt:
 *           type: string | null
 *           format: date-time
 *           description: 전화번호 인증일
 *         uid:
 *           type: string
 *           description: id를 노출하지 않기 위해 사용하는 unique id 값
 *         nickname:
 *           type: string
 *           description: 닉네임
 *         email:
 *           type: string
 *           description: 이메일
 *         password:
 *           type: string
 *           description: 패스워드
 *         tel:
 *           type: string
 *           description: 연락처(010********)
 *         isTelCertified:
 *           type: boolean
 *           description: 연락처 인증 여부
 */

export default class User extends BaseModel {
  public static table = 'user'
  public static tablePrimaryKey = 'user.id'

  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @column.dateTime()
  public lastLoginedAt: DateTime | null

  @column()
  public email: string

  @column()
  public name: string

  @column()
  public nickname: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public tel: string

  @column.dateTime()
  public telVerifiedAt: DateTime | null

  @column({
    columnName: 'is_tel_certified', serializeAs: 'isTelCertified',
    // eslint-disable-next-line max-len
    prepare: (value: boolean | string | null) => value === null ? null : value === 'true' || value === true ? true : false,
    consume: (value: boolean | null) => value === null ? null : value ? true : false,
  })
  public isTelCertified: boolean

  @beforeCreate()
  public static async setUid (user: User) {
    user.uid = generator({ chars: 'default' }).generate(10)
  }

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
