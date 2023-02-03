import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvalidCredentialsException from 'App/Exceptions/InvalidCredentialsException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import ValidationFailedException from 'App/Exceptions/ValidationFailedException'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException'
import PhoneAuthentication from 'App/Models/PhoneAuthentication'
import BadRequestException from 'App/Exceptions/BadRequestException'
import dayjs from 'dayjs'
export default class UsersController {
  /**
   * @swagger
   * /users/myInfo:
   *    get:
   *      tags:
   *        - 회원
   *      summary: 회원 정보
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        200:
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/User'
   *        401:
   *          description: E_UNAUTHORIZED_ACCESS
   */
  public async getAction ({ auth }: HttpContextContract) {
    const user = auth.user

    if (!user) {
      throw new UnAuthorizedException('잘못된 접근입니다.')
    }else {
      return user
    }
  }

  /**
   * @swagger
   * /login:
   *    post:
   *      tags:
   *        - 회원
   *      summary: 로그인
   *      requestBody:
   *        $ref: '#/components/requestBodies/postLoginValidator'
   *      responses:
   *        200:
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  type:
   *                    type: string
   *                    description: token type
   *                  token:
   *                    type: string
   *                    description: token
   *        400:
   *          description: Bad Request
   *        401:
   *          description: unauthorized
   */
  public async postLoginAction ({ request, auth }: HttpContextContract) {
    await UserValidator.postLoginValidator(request)
    let res: object = {}

    try {
      res = await auth.use('api').attempt(request.input('email'), request.input('password'))
    } catch (error) {
      throw new InvalidCredentialsException('비밀번호를 정확히 입력해 주세요.')
    }

    const user = await User.find(auth.user?.id)
    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.')
    }

    if (user) {
      const hasPassword = await Hash.verify(user?.password, request.input('password'))
      if (!hasPassword) {
        throw new NotFoundException('회원을 찾을 수 없습니다.')
      }
    }

    if (user && user.id) {
      user.lastLoginedAt = DateTime.local()

      await user.save()
    }

    return {
      token: res['token'],
      type: res['type'],
    }
  }

  /**
   * @swagger
   * /users:
   *    post:
   *      tags:
   *        - 회원
   *      summary: 회원 등록 (회원 가입)
   *      requestBody:
   *        $ref: '#/components/requestBodies/postUserValidator'
   *      responses:
   *        201:
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/User'
   *        412:
   *          description: validator error
   *        422:
   *          description: validator error
   */
  public async postAction ({ request, response }: HttpContextContract) {
    await UserValidator.postUserValidator(request)

    const emailUser = await User.query().where('email', request.input('email')).first()
    const telUser = await User.query().where('tel', request.input('tel')).first()

    if (emailUser) {
      throw new ValidationFailedException('중복된 이메일이 존재합니다.')
    } else if(telUser) {
      throw new ValidationFailedException('중복된 전화번호가 존재합니다.')
    } else if(!request.input('isTelCertified')) {
      throw new ValidationFailedException('전화번호 인증을 해주세요.')
    }else{
      const user = new User()
      user.nickname = request.input('nickname')
      user.email = request.input('email')
      user.password = request.input('password')
      user.name = request.input('name')
      user.tel = request.input('tel')
      user.isTelCertified = request.input('isTelCertified')
      user.telVerifiedAt = request.input('telVerifiedAt')

      await user.save()

      return response.created(user)
    }
  }

  /**
   * @swagger
   * /email-double-check:
   *   get:
   *     tags:
   *       - 회원
   *     summary: 회원 이메일 중복 체크
   *     parameters:
   *       - name: email
   *         description: 이메일
   *         in: query
   *         required: true
   *         type: intger
   *     responses:
   *        200:
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  isEmail:
   *                    type: boolean
   *                    description: 이메일 중복 여부
   */
  public async getEmailDoubleCheckAction ({ request }: HttpContextContract) {
    if (!request.input('email')) {
      throw new BadRequestException('이메일을 입력해주세요.')
    }

    const user = await User.query()
      .where('email', request.input('email'))
      .first()

    return {
      isEmail: user ? true : false,
    }
  }

  /**
   * @swagger
   * /tel-auth:
   *    post:
   *      tags:
   *        - 회원
   *      summary: 회원 연락처 인증 (문자발송)
   *      requestBody:
   *        $ref: '#/components/requestBodies/postTelAuthenticationValidator'
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        201:
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/PhoneAuthentication'
   *        400:
   *          description: error
   *        422:
   *          description: validator error
   */
  public async postTelAuthenticationAction ({ auth, request, response }: HttpContextContract) {
    const user: User | null = auth && auth.user ? auth.user : null

    if (user) {
      request.updateQs({
        id: user.id,
        userEmail: request.input('email'),
        userTel: request.input('tel'),
      })
    } else {
      request.updateQs({ uniqueEmail: request.input('email'), uniqueTel: request.input('tel') })
    }

    await UserValidator.postTelAuthenticationValidator(request, user?.id ? user.id : null)

    if (request.input('tel')) {
      const phoneAuthentication = new PhoneAuthentication()
      phoneAuthentication.userId = user ? user.id : null
      phoneAuthentication.phoneNumber = request.input('tel')
      phoneAuthentication.expiredAt = request.input('expiredAt')
      phoneAuthentication.email = request.input('email')
      await (await phoneAuthentication.save()).refresh()

      return response.created(phoneAuthentication)
    } else {
      throw new ValidationFailedException('전화번호를 입력해주세요.')
    }
  }

  /**
   * @swagger
   * /tel-auth-confirm:
   *    get:
   *      tags:
   *        - 회원
   *      summary: 회원 연락처 인증 코드 확인
   *      parameters:
   *       - name: verificationCode
   *         description: 문자 발송된 인증 코드(숫자 6자리)
   *         in: query
   *         required: true
   *         type: string
   *       - name: email
   *         description: 이메일
   *         in: query
   *         required: true
   *         type: string
   *       - name: tel
   *         description: 연락처
   *         in: query
   *         required: true
   *         type: string
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        200:
   *          description: 성공,
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  success:
   *                    type: boolean
   *                    description: 인증코드 확인 여부
   *        404:
   *          description: Not Found
   *        412:
   *          description: validator error
   *        401:
   *          description: Not Found
   */
  public async getTelAuthenticationConfirmAction ({ request }: HttpContextContract) {
    if (!request.input('verificationCode')) {
      throw new ValidationFailedException('인증번호를 입력해주세요.')
    }

    const phoneAuthentication = await PhoneAuthentication.query()
      .where('email', request.input('email'))
      .orderBy('id', 'desc')
      .first()
    if (phoneAuthentication) {
      const expireAt = phoneAuthentication.expiredAt
        ? phoneAuthentication.expiredAt.toFormat('yyyy-MM-dd HH:mm:ss')
        : null

      const expireUnix = expireAt ? dayjs(expireAt).unix() : 0
      const nowUnix = dayjs().unix()

      if (nowUnix > expireUnix) {
        throw new ValidationFailedException('인증번호가 만료되었습니다.')
      }

      if (
        phoneAuthentication.verificationCode === request.input('verificationCode') &&
        phoneAuthentication.email === request.input('email') &&
        phoneAuthentication.phoneNumber === request.input('tel')
      ) {
        return { success: true }
      } else {
        return { success: false }
      }
    } else {
      throw new UnAuthorizedException('잘못된 접근입니다.')
    }
  }

  /**
   * @swagger
   * /change-password:
   *    post:
   *      tags:
   *        - 회원
   *      summary: 패스워드 변경
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        $ref: '#/components/requestBodies/patchPassword'
   *      responses:
   *        200:
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/User'
   *        404:
   *          description: not found
   *        422:
   *          description: validator error
   */
  public async postChangePasswordAction ({ request }: HttpContextContract) {
    const user: User | null = await User.query()
      .where('tel', request.input('tel'))
      .orWhere('email', request.input('email'))
      .first()

    if (user) {
      await UserValidator.patchPassword(request)

      user.password = request.input('password')
      await (await user.save()).refresh()

      return user
    }else {
      throw new NotFoundException('회원을 찾을 수 없습니다.')
    }
  }
}

