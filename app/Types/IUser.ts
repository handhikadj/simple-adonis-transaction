/* eslint-disable @typescript-eslint/naming-convention */

import User from 'App/Models/User'

interface CommonObject {
  [key: string]: any
}

export interface IUserResponse {
  statusCode: number
  data: User | CommonObject
}
