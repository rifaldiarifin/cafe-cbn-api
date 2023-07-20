import { type Request, type Response } from 'express'
import { logger } from '../utils/logger'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import {
  createUser,
  createUserAccess,
  createUserContact,
  updateUserByID,
  deleteUserByID,
  findUserByID,
  getUsersFromDB,
  updateAccessUserByID,
  updateContactUserByID
} from '../services/personal.service'
import responseHandler from '../utils/responsehandle'
import { timestamps } from '../utils/date'
import {
  createAccessUserValidation,
  createContactUserValidation,
  createUserValidation,
  updateAccessUserValidation,
  updateContactUserValidation,
  updateUserValidation
} from '../validations/auth.validation'

export const getUser = async (req: Request, res: Response) => {
  try {
    const users: any = await getUsersFromDB()
    logger.info(`Success get users, result: ${users.length}`)
    responseHandler(['OK', 200, `Success get users, result:${users.length}`, users], res)
  } catch (error: any) {
    logger.info(`Failed to fetch data from database, result:${error.message}`)
    responseHandler([false, 404, `Failed to fetch data from database, result:${error.message}`, []], res)
  }
}

export const getUserByID = async (req: Request, res: Response) => {
  const uuid: string = req.params.id
  try {
    const result: any = await findUserByID(uuid)
    if (!result) {
      return responseHandler(['OK', 200, 'Success get user', result], res)
    }
    responseHandler([false, 404, 'Data not found', []], res)
  } catch (error: any) {
    logger.error(error.message)
    responseHandler([false, 422, error.message, []], res)
  }
}

export const addUser = async (req: Request, res: Response) => {
  const userid = new mongoose.Types.ObjectId()
  const accessid = new mongoose.Types.ObjectId()
  const contactid = new mongoose.Types.ObjectId()

  req.body._id = userid
  req.body.uuid = uuidv4()
  req.body.createdAt = timestamps()
  req.body.updatedAt = timestamps()
  req.body.personalAccess = accessid
  req.body.personalContact = contactid

  req.body.contact._id = contactid
  req.body.contact.uuid = uuidv4()
  req.body.contact.user = userid
  req.body.contact.createdAt = timestamps()
  req.body.contact.updatedAt = timestamps()

  req.body.access._id = accessid
  req.body.access.uuid = uuidv4()
  req.body.access.user = userid
  req.body.access.createdAt = timestamps()
  req.body.access.updatedAt = timestamps()

  // Validate request body
  const userValidate: any = createUserValidation(req.body)
  const accessValidate: any = createAccessUserValidation(req.body.access)
  const contactValidate: any = createContactUserValidation(req.body.contact)

  // Check User Validate
  if (userValidate.error) {
    logger.error(`ERROR: Users - Create = ${userValidate.error.details[0].message}`)
    return responseHandler([false, 422, userValidate.error.details[0].message, []], res)
  }

  // Check Access User Validate
  if (accessValidate.error) {
    logger.error(`ERROR: Users - Create = ${accessValidate.error.details[0].message}`)
    return responseHandler([false, 422, accessValidate.error.details[0].message, []], res)
  }

  // Check Contact User Validate
  if (contactValidate.error) {
    logger.error(`ERROR: Users - Create = ${contactValidate.error.details[0].message}`)
    return responseHandler([false, 422, contactValidate.error.details[0].message, []], res)
  }

  // Success validate
  try {
    await createUser(userValidate.value)
    await createUserAccess(userValidate.value.access)
    await createUserContact(userValidate.value.contact)
    logger.info('Success add user!')
    responseHandler(['OK', 201, 'Success add user!', []], res)
  } catch (error: any) {
    logger.error(error.message)
    return responseHandler([false, 422, error.message, []], res)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  // Validate request body
  const userValidate: any = updateUserValidation(req.body)
  const accessValidate: any = updateAccessUserValidation(req.body.access)
  const contactValidate: any = updateContactUserValidation(req.body.contact)

  // Check Body Request Function
  const checkReqBody = () => {
    return Object.keys(req.body ?? {}).length > 2
  }
  const checkReqAccess = () => {
    return Object.keys(req.body.access ?? {}).length > 0
  }
  const checkReqContact = () => {
    return Object.keys(req.body.contact ?? {}).length > 0
  }
  const checkAllReqBody = () => {
    return checkReqBody() || checkReqAccess() || checkReqContact()
  }

  // Check User Validate
  if (userValidate.error) {
    logger.error(`ERROR: Users - Update = ${userValidate.error.details[0].message}`)
    return responseHandler([false, 422, userValidate.error.details[0].message, []], res)
  }

  // Check Access User Validate
  if (accessValidate.error) {
    logger.error(`ERROR: Users - Update = ${accessValidate.error.details[0].message}`)
    return responseHandler([false, 422, accessValidate.error.details[0].message, []], res)
  }

  // Check Contact User Validate
  if (contactValidate.error) {
    logger.error(`ERROR: Users - Update = ${contactValidate.error.details[0].message}`)
    return responseHandler([false, 422, contactValidate.error.details[0].message, []], res)
  }

  // Success validate
  try {
    const getUUID: any = await findUserByID(req.params.id)
    if (getUUID) {
      if (checkAllReqBody()) {
        userValidate.value.updatedAt = timestamps()
        await updateUserByID(getUUID._id, userValidate.value)
      }

      if (checkReqAccess()) {
        userValidate.value.access.updatedAt = timestamps()
        await updateAccessUserByID(getUUID._id, userValidate.value.access)
      }

      if (checkReqContact()) {
        userValidate.value.contact.updatedAt = timestamps()
        await updateContactUserByID(getUUID._id, userValidate.value.contact)
      }

      logger.info(checkAllReqBody() ? 'Success update user' : 'Nothing update')
      responseHandler(['OK', 201, checkAllReqBody() ? 'Success update user' : 'Nothing update', []], res)
    } else {
      logger.info('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
  } catch (error: any) {
    logger.error(error.message)
    return responseHandler([false, 422, error.message, []], res)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const id: string = req.params.id
  try {
    const check: any = await findUserByID(id)
    if (check) {
      await deleteUserByID(check._id)
      logger.info('Success delete user')
      responseHandler(['OK', 201, 'Success delete user', []], res)
    } else {
      logger.info('Data not found')
      responseHandler([false, 404, 'Data not found', []], res)
    }
  } catch (error: any) {
    logger.error(error.message)
    responseHandler([false, 422, error.message, []], res)
  }
}
