import { type Request, type Response } from 'express'
import { logger } from '../utils/logger'
import responseHandler from '../utils/responsehandle'
import { createSessionValidation } from '../validations/auth.validation'
import { findUserByUsername } from '../services/auth.service'
import { checkPassword } from '../utils/hashing'
import { signJWT } from '../utils/jwt'

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body)
  if (error) {
    logger.error(`ERROR: Auth - Create Session = ${error.details[0].message}`)
    return responseHandler([false, 422, error.details[0].message, []], res)
  }

  try {
    const user: any = await findUserByUsername(value.username)
    if (!user) return responseHandler([false, 401, 'Account not found', []], res)
    const isValid = checkPassword(value.password, user.password)

    if (!isValid) return responseHandler([false, 401, 'Invalid email or password', []], res)

    const accessToken = signJWT({ ...user }, { expiresIn: '1d' })

    return responseHandler(['OK', 200, 'Login Success', { accessToken }], res)
  } catch (error: any) {
    logger.error(`ERROR: Auth - Create Session = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}

export const refresh = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Success refresh!'
  })
}
