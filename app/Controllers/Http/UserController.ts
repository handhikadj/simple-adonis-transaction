import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'
import { schema } from '@ioc:Adonis/Core/Validator'
import { inject } from '@adonisjs/fold'

@inject()
export default class UserController {
  constructor(private readonly userService: UserService) {}

  public async register({ request, response }: HttpContextContract): Promise<void> {
    await request.validate({
      schema: schema.create({
        name: schema.string(),
      }),
    })

    const user = await this.userService.register(request.input('name'))

    return response.status(user.statusCode).send(user.data)
  }

  public async deposit({ request, response }: HttpContextContract): Promise<void> {
    await request.validate({
      schema: schema.create({
        userId: schema.number(),
        amount: schema.number(),
      }),
    })

    const user = await this.userService.deposit(request.input('userId'), request.input('amount'))

    return response.status(user.statusCode).send(user.data)
  }

  public async withdraw({ request, response }: HttpContextContract): Promise<void> {
    await request.validate({
      schema: schema.create({
        userId: schema.number(),
        amount: schema.number(),
      }),
    })

    const user = await this.userService.withdraw(request.input('userId'), request.input('amount'))

    return response.status(user.statusCode).send(user.data)
  }
}
