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
| new NotFoundException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NotFoundException extends Exception {
  constructor (message: string) {
    super(message, 404)
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
