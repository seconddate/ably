import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvalidCredentialsException from 'App/Exceptions/InvalidCredentialsException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import ValidationFailedException from 'App/Exceptions/ValidationFailedException'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'

export default class UsersController {
  /**
   * @swagger
   * /users:
   *    get:
   *      tags:
   *        - 회원
   *      summary: 회원 정보
   *      requestBody:
   *        $ref: '#/components/requestBodies/getUserValidator'
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
  public async getAction ({ request, response }: HttpContextContract) {
    await UserValidator.postUserValidator(request)

    const emailUser = await User.query().where('email', request.input('email')).first()
    const telUser = await User.query().where('tel', request.input('tel')).first()

    if (emailUser) {
      throw new ValidationFailedException('중복된 이메일이 존재합니다.')
    } else if(telUser) {
      throw new ValidationFailedException('중복된 전화번호가 존재합니다.')
    } else {
      const user = new User()
      user.nickname = request.input('nickname')
      user.email = request.input('email')
      user.password = request.input('password')
      user.name = request.input('name')
      user.tel = request.input('tel')
      user.isTelCertified = request.input('isTelCertified')

      await user.save()

      return response.created(user)
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
   *                  expires_at:
   *                    type: string
   *                    description: token 만료일자
   *        400:
   *          description: Bad Request
   *        401:
   *          description: unauthorized
   */
  public async postLoginAction ({ request, auth }: HttpContextContract) {
    await UserValidator.postLoginValidator(request)

    try {
      await auth.use('api').attempt(request.input('email'), request.input('password'))
    } catch (error) {
      console.log(error)
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
    return auth.user
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
    } else {
      const user = new User()
      user.nickname = request.input('nickname')
      user.email = request.input('email')
      user.password = request.input('password')
      user.name = request.input('name')
      user.tel = request.input('tel')
      user.isTelCertified = request.input('isTelCertified')

      await user.save()

      return response.created(user)
    }
  }
}
