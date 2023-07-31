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
} from '../services/user.service'
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
import { hashing } from '../utils/hashing'

export const getUser = async (req: Request, res: Response) => {
  try {
    const users: any = await getUsersFromDB()
    logger.info(`Success get users, result: ${users.length}`)
    responseHandler(['OK', 200, `Success get users, result:${users.length}`, users], res)
  } catch (error: any) {
    logger.info(`ERROR: Users - Get All Users = ${error.message}`)
    responseHandler([false, 404, error.message, []], res)
  }
}

export const getUserByID = async (req: Request, res: Response) => {
  const uuid: string = req.params.id
  try {
    const result: any = await findUserByID(uuid)
    if (!result) {
      logger.info('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    return responseHandler(['OK', 200, 'Success get user', result], res)
  } catch (error: any) {
    logger.error(`ERROR: Users - Get Users = ${error.message}`)
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
  req.body.access = accessid
  req.body.contact = contactid

  req.body.userContact._id = contactid
  req.body.userContact.uuid = uuidv4()
  req.body.userContact.user = userid
  req.body.userContact.createdAt = timestamps()
  req.body.userContact.updatedAt = timestamps()

  req.body.userAccess._id = accessid
  req.body.userAccess.uuid = uuidv4()
  req.body.userAccess.user = userid
  req.body.userAccess.createdAt = timestamps()
  req.body.userAccess.updatedAt = timestamps()

  // Validate request body
  const userValidate: any = createUserValidation(req.body)
  const accessValidate: any = createAccessUserValidation(req.body.userAccess)
  const contactValidate: any = createContactUserValidation(req.body.userContact)

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
    userValidate.value.password = `${hashing(userValidate.value.password)}`
    await createUser(userValidate.value)
    await createUserAccess(userValidate.value.userAccess)
    await createUserContact(userValidate.value.userContact)
    logger.info('Success add user!')
    responseHandler(['OK', 201, 'Success add user!', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Users - Create = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  // Validate request body
  const userValidate: any = updateUserValidation(req.body)
  const accessValidate: any = updateAccessUserValidation(req.body.userAccess)
  const contactValidate: any = updateContactUserValidation(req.body.userContact)

  // Check Body Request Function
  const checkReqBody = () => {
    return Object.keys(req.body ?? {}).length > 2
  }
  const checkReqAccess = () => {
    return Object.keys(req.body.userAccess ?? {}).length > 0
  }
  const checkReqContact = () => {
    return Object.keys(req.body.userContact ?? {}).length > 0
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
        userValidate.value.userAccess.updatedAt = timestamps()
        await updateAccessUserByID(getUUID._id, userValidate.value.userAccess)
      }

      if (checkReqContact()) {
        userValidate.value.userContact.updatedAt = timestamps()
        await updateContactUserByID(getUUID._id, userValidate.value.userContact)
      }

      logger.info(checkAllReqBody() ? 'Success update user' : 'Nothing update')
      responseHandler(['OK', 201, checkAllReqBody() ? 'Success update user' : 'Nothing update', []], res)
    } else {
      logger.info('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
  } catch (error: any) {
    logger.error(`ERROR: Users - Update = ${error.message}`)
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
    logger.error(`ERROR: Users - Delete = ${error.message}`)
    responseHandler([false, 422, error.message, []], res)
  }
}
