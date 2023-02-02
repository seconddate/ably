/* eslint-disable max-len */
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export default class UserValidator {
  private static messages = {
    'email.string': '이메일을 입력해주세요.',
    'email.email': '이메일 형식을 확인해주세요.',
    'email.unique': '중복된 이메일이 존재합니다.',
    'email.required': '이메일을 입력해주세요.',
    'email.exists': '이메일이 존재하지 않습니다.',
    'password.required': '비밀번호를 입력해주세요.',
    'password.regex': '비밀번호는 최소 8~16자 사이의 영문, 숫자, 특수문자의 조합으로 입력해 주세요',
    'passwordConfirmation.confirmed': '비밀번호를 정확히 입력해 주세요.',
    'name.required': '이름을 입력해주세요.',
    'name.regex': '이름은 한글만 입력 가능합니다.',
    'tel.required': '전화번호를 입력해주세요.',
    'tel.regex': '전화번호 형식을 확인해주세요.',
    'isTelCertified.required': '전화번호 인증을 해주세요.',
    'isTelCertified.boolean': '전화번호 인증을 해주세요.',
  }

  /**
   * @swagger
   * components:
   *  requestBodies:
   *    postLoginValidator:
   *      description: 회원 로그인
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            type: object
   *            properties:
   *              email: 
   *                type: string
   *                required: true
   *                description: 이메일 주소
   *              password:
   *                type: string
   *                required: true
   *                description: 패스워드(regex:/^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/)
   *            required:
   *              - email
   *              - password
   */
  public static async postLoginValidator (request: RequestContract) {
    const validator = {
      schema: schema.create({
        email: schema.string.optional({
          trim: true,
        }, [
          rules.email(),
          rules.exists({ table: 'user', column: 'email' }), // , whereNot:{email_verified_at: null}
        ]),
        tel: schema.string.optional({
          trim: true,
        }, [
          rules.exists({ table: 'user', column: 'tel' }), // , whereNot:{email_verified_at: null}
        ]),
        password: schema.string({}, [
          // rules.regex(/^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/),
        ]),
      }),
    }
    await request.validate({
      schema: validator.schema,
      messages: UserValidator.messages,
    })
  }

  /**
   * @swagger
   * components:
   *  requestBodies:
   *    postUserValidator:
   *      description: 회원 가입
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            type: object
   *            properties:
   *              email: 
   *                type: string
   *                required: true
   *                description: 이메일 주소
   *              nickname: 
   *                type: string
   *                required: true
   *                description: 닉네임
   *              name: 
   *                type: string
   *                required: true
   *                description: 이름
   *              password:
   *                type: string
   *                required: true
   *                description: 패스워드(regex:/^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/)
   *              passwordConfirmation:
   *                type: string
   *                required: true
   *                description: 패스워드 확인
   *              tel:
   *                type: string
   *                required: false
   *                description: 연락처
   *              isTelCertified:
   *                type: boolean
   *                required: false
   *                description: 휴대폰 인증여부
   *            required:
   *              - email
   *              - name
   *              - nickname
   *              - password
   *              - passwordConfirmation
   *              - tel
   *              - isTelCertified
   */
  public static async postUserValidator (request: RequestContract) {
    const validator = {
      schema: schema.create({
        email: schema.string({
          trim: true,
        }, [
          rules.email(),
          // rules.unique({ table: 'user', column: 'email'}),
        ]),
        password: schema.string({}, [
          rules.confirmed('passwordConfirmation'),
          rules.minLength(8),
          rules.maxLength(16),
          rules.regex(/^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/),
        ]),
        name: schema.string({}, [
          rules.regex(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/),
        ]),
        nickname: schema.string(),
        tel: schema.string({}, [
          rules.regex(/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/g),
        ]),
        isTelCertified: schema.boolean(),
      }),
    }

    await request.validate({
      schema: validator.schema,
      messages: UserValidator.messages,
    })
  }
}
