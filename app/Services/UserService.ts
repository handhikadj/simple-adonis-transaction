import User from 'App/Models/User'
import { IUserResponse } from 'App/Types/IUser'
import Utils from 'App/Utils/Utils'

export default class UserService {
  public async register(name: string): Promise<IUserResponse> {
    const user = await User.create({ name })
    await user.refresh()

    return {
      statusCode: 200,
      data: user,
    }
  }

  public async deposit(userId: number, amount: string): Promise<IUserResponse> {
    const user = await User.find(userId)

    if (!user) {
      return {
        statusCode: 404,
        data: {
          message: 'User not found',
        },
      }
    }

    const balance = Utils.sumDecimal(amount, user.balance)

    await User.query().where('id', userId).update({ balance })
    await user.refresh()

    return {
      statusCode: 200,
      data: {
        ...user.toJSON(),
        current_balance: user.balance,
      },
    }
  }

  public async withdraw(userId: number, amount: string): Promise<IUserResponse> {
    const user = await User.find(userId)

    if (!user) {
      return {
        statusCode: 404,
        data: {
          message: 'User not found',
        },
      }
    }

    const balance = Utils.substrDecimal(amount, user.balance)

    if (!balance) {
      return {
        statusCode: 406,
        data: {
          message: `Cannot over-withdraw / having negative balance. Current balance: ${user.balance}`,
          current_balance: user.balance,
        },
      }
    }

    await User.query().where('id', userId).update({ balance })
    await user.refresh()

    return {
      statusCode: 200,
      data: {
        ...user.toJSON(),
        current_balance: user.balance,
      },
    }
  }
}
