import { type Request, type Response } from 'express'
import { logger } from '../utils/logger'
import responseHandler from '../utils/responsehandle'
import { createSessionValidation, tokenValidation } from '../validations/auth.validation'
import { findUserByUsername } from '../services/auth.service'
import { checkPassword } from '../utils/hashing'
import { signJWT, verifyJWT } from '../utils/jwt'
interface JwtType {
  valid: boolean
  expired: boolean
  decoded: any
  message: string
}

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
    if (!user) {
      logger.error('ERROR: Auth - Create Session = Account not found')
      return responseHandler([false, 404, 'Account not found', []], res)
    }
    const isValid = checkPassword(value.password, user.password)

    if (!isValid) {
      logger.error('ERROR: Auth - Create Session = Invalid Username or Password')
      return responseHandler([false, 401, 'Invalid Username or Password', []], res)
    }

    const dataUser = structureUser(user)

    const accessToken = signJWT({ ...dataUser }, { expiresIn: '1d' })
    const refreshToken = signJWT({ ...dataUser }, { expiresIn: '30d' })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30
    })

    logger.info('Login Success')
    return responseHandler(['OK', 200, 'Login Success', { accessToken }], res)
  } catch (error: any) {
    logger.error(`ERROR: Auth - Create Session = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}

export const refreshSession = async (req: Request, res: Response) => {
  const refreshToken: any = req.cookies.refresh_token

  try {
    const { valid, expired, decoded, message }: JwtType = verifyJWT(refreshToken)

    if (!valid) {
      logger.error(`ERROR: Auth - Refresh Session = ${message}`)
      return responseHandler(
        [false, 401, `Refresh Session Failed, Message: ${message}`, { valid, expired, decoded }],
        res
      )
    }
    const user = await findUserByUsername(decoded?.username)
    if (!user) {
      logger.error('ERROR: Auth - Refresh Session = Invalid Token')
      return responseHandler([false, 401, 'Refresh Session Failed, Message: Invalid Token', {}], res)
    }

    const accessToken = signJWT({ ...structureUser(user) }, { expiresIn: '1d' })

    logger.info('Refresh Session Success')
    return responseHandler(['OK', 200, 'Refresh Session Success', { accessToken }], res)
  } catch (error: any) {
    logger.error(`ERROR: Auth - Refresh Session = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}

export const verifyToken = (req: Request, res: Response) => {
  const { error, value } = tokenValidation(req.body)
  if (error) {
    logger.error(`ERROR: Auth - Verify Token = ${error.details[0].message}`)
    return responseHandler([false, 401, `Verify Token Failed, Message: ${error.details[0].message}`, []], res)
  }

  try {
    const { valid, expired, message }: JwtType = verifyJWT(value.token)

    if (!valid) {
      logger.error(`ERROR: Auth - Verify Token = ${message}`)
      return responseHandler([false, 401, `Verify Token Failed, Message: ${message}`, { valid, expired }], res)
    }
    logger.info('Verify Token Success')
    return responseHandler(['OK', 200, 'Verify Token Success', { valid, expired }], res)
  } catch (error: any) {
    logger.error(`ERROR: Auth - Verify Token = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}

export const clearSession = (req: Request, res: Response) => {
  try {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: true,
      secure: true
    })

    logger.info('Clear Session Success')
    return responseHandler(['OK', 200, 'Clear Session Success', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Auth - Clear Session = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}
