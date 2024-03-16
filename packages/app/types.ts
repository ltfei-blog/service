import type { Request as ExpressRequest } from 'express'
import joi from 'joi'

export type TokenUser = {
  id: number
}

export type ValidateBody = <T>(schema: {
  [key in keyof T]: joi.SchemaLike | joi.SchemaLike[]
}) => T | false

export interface Request extends ExpressRequest {
  auth: TokenUser
  validateBody: ValidateBody
}
