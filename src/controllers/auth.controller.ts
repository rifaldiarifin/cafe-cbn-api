import { type Request, type Response } from 'express'
import { logger } from '../utils/logger'
import responseHandler from '../utils/responsehandle'
import { createSessionValidation, refreshSessionValidation } from '../validations/auth.validation'
import { findUserByUsername } from '../services/auth.service'
import { checkPassword } from '../utils/hashing'
import { signJWT, verifyJWT } from '../utils/jwt'

const structureUser = (data: any) => {
  const { uuid, firstname, lastname, username, profileImage, access } = data
  return {
    uuid,
    firstname,
    lastname,
    fullname: `${firstname} ${lastname}`,
    username,
    profileImage,
    role: access.role
  }
}

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

    if (!isValid) return responseHandler([false, 401, 'Invalid Username or Password', []], res)

    const accessToken = signJWT({ ...structureUser(user) }, { expiresIn: '1d' })

    return responseHandler(['OK', 200, 'Login Success', { accessToken }], res)
  } catch (error: any) {
    logger.error(`ERROR: Auth - Create Session = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body)

  if (error) {
    logger.error(`ERROR: Auth - Refresh Session = ${error.details[0].message}`)
    return responseHandler([false, 422, error.details[0].message, []], res)
  }

  try {
    const { decoded }: any = verifyJWT(value.refreshToken)

    const user = await findUserByUsername(decoded._doc.username)
    if (!user) return false

    const accessToken = signJWT(
      {
        ...structureUser(user)
      },
      { expiresIn: '1d' }
    )
    return responseHandler(['OK', 200, 'Refresh Session Success', { accessToken }], res)
  } catch (error: any) {
    logger.error(`ERROR: Auth - Refresh Session = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}
