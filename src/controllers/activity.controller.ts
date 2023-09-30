import { type Request, type Response } from 'express'
import { logger } from '../utils/logger'
import { v4 as uuidv4 } from 'uuid'
import responseHandler from '../utils/responsehandle'
import { timestamps } from '../utils/date'
import { findIdUserByUuid } from '../services/user.service'
import { createActivityValidation, updateActivityValidation } from '../validations/activity.validation'
import {
  addActivity,
  deleteActivityByID,
  findActivityByIDFromDB,
  findActivityFromDB,
  findMyActivityFromDB,
  updateActivityByID
} from '../services/activity.service'

// CREATE
export const createActivity = async (req: Request, res: Response) => {
  const { _id }: any = await findIdUserByUuid(res.locals.user.uuid)
  req.body.uuid = uuidv4()
  req.body.user = {
    data: _id,
    fullname:
      res.locals.user.lastname.length > 0
        ? `${res.locals.user.firstname} ${res.locals.user.lastname}`
        : `${res.locals.user.firstname}`
  }
  req.body.createdAt = timestamps()
  req.body.updatedAt = timestamps()

  const { error, value } = createActivityValidation(req.body)

  if (error) {
    logger.error(`ERROR: Activity - Create = ${error.details[0].message}`)
    return responseHandler([false, 422, `ERROR: Activity - Create = ${error.details[0].message}`, []], res)
  }

  try {
    await addActivity(value)
    logger.info('Success create activity')
    return responseHandler(['Created', 201, 'Success create activity', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Activity - Create = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Activity - Create = ${error.message}`, []], res)
  }
}

// READ
export const getActivity = async (req: Request, res: Response) => {
  try {
    const result: any = await findActivityFromDB()
    logger.info('Success get all activity')
    return responseHandler(['OK', 200, 'Success get all activity', result], res)
  } catch (error: any) {
    logger.error(`ERROR: Activity - Get All = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Activity - Get All = ${error.message}`, []], res)
  }
}

export const getActivityByID = async (req: Request, res: Response) => {
  const id: string = req.params.id

  try {
    const result: any = await findActivityByIDFromDB(id)
    if (!result) {
      logger.info('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    logger.info('Success get activity')
    return responseHandler(['OK', 200, 'Success get activity', result], res)
  } catch (error: any) {
    logger.error(`ERROR: Activity - Get = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Activity - Get = ${error.message}`, []], res)
  }
}

export const getMyActivity = async (req: Request, res: Response) => {
  const uuid: string = res.locals.user.uuid

  try {
    const { _id }: any = await findIdUserByUuid(uuid)
    const result: any = await findMyActivityFromDB(_id)
    logger.info('Success get your activity')
    return responseHandler(['OK', 200, 'Success get your activity', result], res)
  } catch (error: any) {
    logger.error(`ERROR: Activity - Get = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Activity - Get = ${error.message}`, []], res)
  }
}

// UPDATE
export const updateActivity = async (req: Request, res: Response) => {
  req.body.updatedAt = timestamps()

  const { error, value } = updateActivityValidation(req.body)

  if (error) {
    logger.error(`ERROR: Activity - Update = ${error.details[0].message}`)
    return responseHandler([false, 422, `ERROR: Activity - Update = ${error.details[0].message}`, []], res)
  }

  try {
    await updateActivityByID(value)
    logger.info('Success update activity')
    return responseHandler(['OK', 200, 'Success update activity', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Activity - Update = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Activity - Update = ${error.message}`, []], res)
  }
}

// DELETE
export const deleteActivity = async (req: Request, res: Response) => {
  const id: string = req.params.id

  try {
    const check: any = await deleteActivityByID(id)
    if (!check) {
      logger.info('Data not found')
      return responseHandler([false, 422, 'Data not found', []], res)
    }
    logger.info('Success delete activity')
    return responseHandler(['OK', 200, 'Success delete activity', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Activity - Delete = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Activity - Delete = ${error.message}`, []], res)
  }
}
