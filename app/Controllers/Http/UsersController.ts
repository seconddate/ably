import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async cgetAction ({ request }: HttpContextContract) {
    return await User.query().paginate(request.input('page', 1), request.input('perPage', 10))
  }
}
