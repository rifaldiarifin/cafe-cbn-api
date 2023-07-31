import { type Request, type Response } from 'express'
import mongoose from 'mongoose'
import menuCode from '../utils/menuCodeGenerate'
import { v4 as uuidv4 } from 'uuid'
import {
  createMenuRatingsValidation,
  createMenuTypeValidation,
  createMenuValidation,
  updateMenuRatingsValidation,
  updateMenuTypeValidation,
  updateMenuValidation
} from '../validations/menu.validation'
import { timestamps } from '../utils/date'
import responseHandler from '../utils/responsehandle'
import { logger } from '../utils/logger'
import {
  createMenu,
  createMenuRatings,
  createMenuType,
  deleteMenu,
  findMenuByIDFromDB,
  findMenuFromDB,
  findMenuOnlyByIDFromDB,
  findRatingsOnlyByIDFromDB,
  updateMenuFromDB,
  updateMenuRatings,
  updateMenuType
} from '../services/menu.service'
import { findUserByID } from '../services/user.service'

export const getMenu = async (req: Request, res: Response) => {
  try {
    const result: any = await findMenuFromDB()
    logger.info('Success get menu data')
    return responseHandler(['OK', 200, 'Success get menu data', result], res)
  } catch (error: any) {
    logger.info(`ERROR: Menu - Get Menu = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Menu - Get Menu = ${error.message}`, []], res)
  }
}

export const getMenuByID = async (req: Request, res: Response) => {
  const id: string = req.params.id
  try {
    const result: any = await findMenuByIDFromDB(id)
    if (!result) {
      logger.error('Data not found')
      return responseHandler([false, 404, 'Data not found', result], res)
    }
    logger.info('Success get menu data')
    return responseHandler(['OK', 200, 'Success get menu data', result], res)
  } catch (error: any) {
    logger.info(`ERROR: Menu - Get All User = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Menu - Get All User = ${error.message}`, []], res)
  }
}

export const addMenu = async (req: Request, res: Response) => {
  const menuid = new mongoose.Types.ObjectId()
  const typeid = new mongoose.Types.ObjectId()

  req.body._id = menuid
  req.body.uuid = uuidv4()
  req.body.menuCode = menuCode()
  req.body.menuType = typeid
  req.body.createdAt = timestamps()
  req.body.updatedAt = timestamps()

  req.body.type._id = typeid
  req.body.type.uuid = uuidv4()
  req.body.type.menu = menuid
  req.body.type.createdAt = timestamps()
  req.body.type.updatedAt = timestamps()

  // Request body validation
  const menuValidate: any = createMenuValidation(req.body)
  const typeValidate: any = createMenuTypeValidation(req.body.type)

  // Check error validation
  if (menuValidate.error) {
    logger.error(`ERROR: Menu - Create Menu = ${menuValidate.error.details[0].message}`)
    return responseHandler([false, 422, menuValidate.error.details[0].message, []], res)
  }

  if (typeValidate.error) {
    logger.error(`ERROR: Menu - Create Menu = ${typeValidate.error.details[0].message}`)
    return responseHandler([false, 422, typeValidate.error.details[0].message, []], res)
  }

  try {
    await createMenu(menuValidate.value)
    await createMenuType(menuValidate.value.type)

    logger.info('Success add menu')
    responseHandler(['OK', 201, 'Success add menu', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Menu - Create = ${error.message}`)
    responseHandler([false, 422, `ERROR: Menu - Create = ${error.message}`, []], res)
  }
}

export const addRatings = async (req: Request, res: Response) => {
  const rateid = new mongoose.Types.ObjectId()
  try {
    const check: any = await findMenuOnlyByIDFromDB(req.body.uuidMenu)
    const menuRatings: any[] = [...check.menuRatings, rateid]
    const { _id }: any = await findUserByID(res.locals.user.uuid)
    if (!check) {
      logger.error('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }

    req.body.menuRatings = menuRatings
    req.body.updatedAt = timestamps()

    req.body.ratings._id = rateid
    req.body.ratings.uuid = uuidv4()
    req.body.ratings.menu = check._id
    req.body.ratings.user = _id
    req.body.ratings.createdAt = timestamps()
    req.body.ratings.updatedAt = timestamps()

    // Request body validation
    const menuValidate: any = updateMenuValidation(req.body)
    const ratingsValidate = createMenuRatingsValidation(req.body.ratings)

    if (menuValidate.error) {
      logger.error(`ERROR: Menu - Give Rating = ${menuValidate.error.details[0].message}`)
      return responseHandler([false, 422, menuValidate.error.details[0].message, []], res)
    }

    if (ratingsValidate.error) {
      logger.error(`ERROR: Menu - Give Rating = ${ratingsValidate.error.details[0].message}`)
      return responseHandler([false, 422, ratingsValidate.error.details[0].message, []], res)
    }

    try {
      await createMenuRatings(menuValidate.value.ratings)
      await updateMenuFromDB(check._id, menuValidate.value)
      logger.info('Success add ratings to menu')
      responseHandler(['OK', 201, 'Success ratings to menu', []], res)
    } catch (error: any) {
      logger.error(`ERROR: Menu - Give Rating = ${error.message}`)
      responseHandler([false, 422, `ERROR: Menu - Give Rating = ${error.message}`, []], res)
    }
  } catch (error: any) {
    logger.error(`ERROR: Menu - Give Rating = ${error.message}`)
    responseHandler([false, 422, `ERROR: Menu - Give Rating = ${error.message}`, []], res)
  }
}

export const updateMenu = async (req: Request, res: Response) => {
  const id: string = req.params.id
  req.body.uuidMenu = id
  try {
    const check: any = await findMenuOnlyByIDFromDB(id)
    if (!check) {
      logger.error('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    // console.log(check)
    // Request body validation
    const menuValidate: any = updateMenuValidation(req.body)
    const typeValidate: any = updateMenuTypeValidation(req.body.type)
    // Check Body Request Function
    const checkReqBody = () => {
      return Object.keys(req.body ?? {}).length > 1
    }
    const checkReqType = () => {
      return Object.keys(req.body.type ?? {}).length > 0
    }
    const checkAllReqBody = () => {
      return checkReqBody() || checkReqType()
    }
    if (menuValidate.error) {
      logger.error(`ERROR: Menu - Update = ${menuValidate.error.details[0].message}`)
      return responseHandler([false, 422, menuValidate.error.details[0].message, []], res)
    }
    if (typeValidate.error) {
      logger.error(`ERROR: Menu - Update = ${typeValidate.error.details[0].message}`)
      return responseHandler([false, 422, typeValidate.error.details[0].message, []], res)
    }
    if (checkAllReqBody()) {
      menuValidate.value.updatedAt = timestamps()
      await updateMenuFromDB(check._id, menuValidate.value)
    }
    if (checkReqType()) {
      menuValidate.value.type.updatedAt = timestamps()
      await updateMenuType(check._id, menuValidate.value.type)
    }
    logger.info(checkAllReqBody() ? 'Success update menu' : 'Nothing Update')
    responseHandler(['OK', 201, checkAllReqBody() ? 'Success update menu' : 'Nothing Update', []], res)
  } catch (error: any) {
    console.log(error)
    logger.error(`ERROR: Menu - Update = ${error.message}`)
    responseHandler([false, 422, error.message, []], res)
  }
}

export const updateRatings = async (req: Request, res: Response) => {
  const id: string = req.params.id

  try {
    const check: any = await findRatingsOnlyByIDFromDB(id)
    if (!check) {
      logger.error('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }

    req.body.updatedAt = timestamps()

    // Request body validation
    const { error, value } = updateMenuRatingsValidation(req.body)

    if (error) {
      logger.error(`ERROR: Menu - Update Rating = ${error.details[0].message}`)
      return responseHandler([false, 422, error.details[0].message, []], res)
    }

    await updateMenuRatings(check._id, value)
    logger.info('Success update rating')
    responseHandler(['OK', 201, 'Success update rating', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Menu - Update Rating = ${error.message}`)
    responseHandler([false, 422, error.message, []], res)
  }
}

export const deleteMenuByID = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    const check: any = await findMenuByIDFromDB(id)
    if (check) {
      await deleteMenu(check._id)
      logger.info('Success delete menu')
      return responseHandler(['OK', 201, 'Success delete menu', []], res)
    } else {
      logger.info('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
  } catch (error: any) {
    logger.error(`ERROR: Menu - Delete = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}
