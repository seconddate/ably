import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new TokensAlreadyUsedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class InvalidCredentialsException extends Exception {
  constructor (message: string) {
    super(message, 400)
  }

  public async handle (error: this, { response }: HttpContextContract) {
    response
      .status(error.status)
      .send({
        error: {
          code: error.status,
          message: error.message,
        },
      })
  }
}
