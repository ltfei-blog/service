import type { Request as ExpressRequest } from 'express'

export type TokenUser = {
  id: number
}

export interface Request extends ExpressRequest {
  auth: TokenUser
}
