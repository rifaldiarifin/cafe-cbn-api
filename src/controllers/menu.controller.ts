import { type Request, type Response } from 'express'
import mongoose from 'mongoose'
import menuCode from '../utils/menuCodeGenerate'
import { v4 as uuidv4 } from 'uuid'
import {
  createMenuGroupValidation,
  createMenuRatingsValidation,
  createMenuValidation,
  updateMenuGroupValidation,
  updateMenuRatingsValidation,
  updateMenuValidation,
  updateMenusInGroupValidation
} from '../validations/menu.validation'
import { timestamps } from '../utils/date'
import responseHandler from '../utils/responsehandle'
import { logger } from '../utils/logger'
import {
  createMenu,
  createMenuGroup,
  createMenuRatings,
  deleteMenu,
  findAllRatingsOnlyByUserFromDB,
  findMenuByIDFromDB,
  findMenuFromDB,
  findMenuOnlyByIDFromDB,
  findRatingsOnlyByIDFromDB,
  updateMenuFromDB,
  updateMenuRatings,
  updateMenuGroupFromDB,
  deleteGroup,
  findMenuGroupsFromDB,
  findMenuGroupByIDFromDB,
  findAllMenusInGroupByID,
  updateMenusInGroupFromDB,
  findMenuGroupsOnlyUuidMenusFromDB,
  findMenuGroupOnlyUuidMenusByIDFromDB,
  findIDMenuByUuidFromDB,
  findAllMenusInAllGroups
} from '../services/menu.service'
import { findIdUserByUuid } from '../services/user.service'
import { addFunc, deleteFunc } from '../utils/reCollectArrayObject'

/* ###################### CREATE ########################### */
export const addMenu = async (req: Request, res: Response) => {
  const menuid = new mongoose.Types.ObjectId()

  req.body._id = menuid
  req.body.uuid = uuidv4()
  req.body.menuCode = menuCode()
  req.body.createdAt = timestamps()
  req.body.updatedAt = timestamps()

  // Request body validation
  const { error, value } = createMenuValidation(req.body)

  // Check error validation
  if (error) {
    logger.error(`ERROR: Menu - Create Menu = ${error.details[0].message}`)
    return responseHandler([false, 422, error.details[0].message, []], res)
  }

  try {
    await createMenu(value)

    logger.info('Success add menu')
    responseHandler(['Created', 201, 'Success add menu', []], res)
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
    const { _id }: any = await findIdUserByUuid(res.locals.user.uuid)
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
      logger.error(`ERROR: Menu - Add Rate = ${menuValidate.error.details[0].message}`)
      return responseHandler([false, 422, menuValidate.error.details[0].message, []], res)
    }

    if (ratingsValidate.error) {
      logger.error(`ERROR: Menu - Add Rate = ${ratingsValidate.error.details[0].message}`)
      return responseHandler([false, 422, ratingsValidate.error.details[0].message, []], res)
    }

    try {
      await createMenuRatings(menuValidate.value.ratings)
      await updateMenuFromDB(check._id, menuValidate.value)
      logger.info('Success add ratings to menu')
      responseHandler(['Created', 201, 'Success ratings to menu', []], res)
    } catch (error: any) {
      logger.error(`ERROR: Menu - Add Rate = ${error.message}`)
      responseHandler([false, 422, `ERROR: Menu - Add Rate = ${error.message}`, []], res)
    }
  } catch (error: any) {
    logger.error(`ERROR: Menu - Add Rate = ${error.message}`)
    responseHandler([false, 422, `ERROR: Menu - Add Rate = ${error.message}`, []], res)
  }
}

export const addMenuGroup = async (req: Request, res: Response) => {
  const groupid = new mongoose.Types.ObjectId()
  req.body._id = groupid
  req.body.uuid = uuidv4()
  req.body.createdAt = timestamps()
  req.body.updatedAt = timestamps()

  try {
    const { error, value } = createMenuGroupValidation(req.body)

    if (error) {
      logger.error(`ERROR: Menu - New Group = ${error.details[0].message}`)
      return responseHandler([false, 422, error.details[0].message, []], res)
    }

    await createMenuGroup(value)

    logger.info('Success add new group')
    responseHandler(['Created', 201, 'Success new group', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Menu - New Group = ${error.message}`)
    responseHandler([false, 422, `ERROR: Menu - New Group = ${error.message}`, []], res)
  }
}

/* ###################### READ ########################### */
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

export const getMenuGroups = async (req: Request, res: Response) => {
  try {
    const result: any = await findMenuGroupsFromDB()
    logger.info('Success get all group')
    return responseHandler(['OK', 200, 'Success get all group', result], res)
  } catch (error: any) {
    logger.info(`ERROR: Menu - Get Menu = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Menu - Get Menu = ${error.message}`, []], res)
  }
}

export const getMenuGroupsOnlyUuid = async (req: Request, res: Response) => {
  try {
    const result: any = await findMenuGroupsOnlyUuidMenusFromDB()
    logger.info('Success get all group only uuid menus')
    return responseHandler(['OK', 200, 'Success get all group only uuid menus', result], res)
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
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    logger.info('Success get menu data')
    return responseHandler(['OK', 200, 'Success get menu data', result], res)
  } catch (error: any) {
    logger.info(`ERROR: Menu - Get All Menu = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Menu - Get All Menu = ${error.message}`, []], res)
  }
}

export const getMenuGroupByID = async (req: Request, res: Response) => {
  const id: string = req.params.id
  try {
    const result: any = await findMenuGroupByIDFromDB(id)
    if (!result) {
      logger.error('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    logger.info('Success get menu group')
    return responseHandler(['OK', 200, 'Success get menu group', result], res)
  } catch (error: any) {
    logger.info(`ERROR: Menu - Get All Menu = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Menu - Get All Menu = ${error.message}`, []], res)
  }
}

export const getMenuGroupOnlyUuidMenusByID = async (req: Request, res: Response) => {
  const id: string = req.params.id
  try {
    const result: any = await findMenuGroupOnlyUuidMenusByIDFromDB(id)
    if (!result) {
      logger.error('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    logger.info('Success get menu group only uuid menus')
    return responseHandler(['OK', 200, 'Success get menu group only uuid menus', result], res)
  } catch (error: any) {
    logger.info(`ERROR: Menu - Get All Menu = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Menu - Get All Menu = ${error.message}`, []], res)
  }
}

export const getRatingByUser = async (req: Request, res: Response) => {
  const id: string = res.locals.user.uuid
  try {
    const { _id }: any = await findIdUserByUuid(id)
    const result: any = await findAllRatingsOnlyByUserFromDB(_id)
    if (!result) {
      logger.error('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    logger.info('Success get rating menu data')
    return responseHandler(['OK', 200, 'Success get rating menu data', result], res)
  } catch (error: any) {
    logger.info(`ERROR: Menu - Get Rating By User = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Menu - Get Rating By User = ${error.message}`, []], res)
  }
}

export const getRatingByID = async (req: Request, res: Response) => {
  const id: string = req.params.id
  try {
    const result: any = await findRatingsOnlyByIDFromDB(id)
    if (!result) {
      logger.error('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    logger.info('Success get rating menu data')
    return responseHandler(['OK', 200, 'Success get rating menu data', result], res)
  } catch (error: any) {
    logger.info(`ERROR: Menu - Get Rating = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Menu - Get Rating = ${error.message}`, []], res)
  }
}

/* ###################### UPDATE ########################### */
export const updateMenu = async (req: Request, res: Response) => {
  const id: string = req.params.id
  req.body.uuidMenu = id
  req.body.updatedAt = timestamps()
  try {
    const check: any = await findMenuOnlyByIDFromDB(id)
    if (!check) {
      logger.error('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }

    // Request body validation
    const menuValidate: any = updateMenuValidation(req.body)

    // Check Body Request Function
    const checkReqBody = () => {
      return Object.keys(req.body ?? {}).length > 1
    }
    if (menuValidate.error) {
      logger.error(`ERROR: Menu - Update = ${menuValidate.error.details[0].message}`)
      return responseHandler([false, 422, menuValidate.error.details[0].message, []], res)
    }
    if (checkReqBody()) {
      menuValidate.value.updatedAt = timestamps()
      await updateMenuFromDB(check._id, menuValidate.value)
    }
    logger.info(checkReqBody() ? 'Success update menu' : 'Nothing Update')
    return responseHandler(['OK', 200, checkReqBody() ? 'Success update menu' : 'Nothing Update', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Menu - Update = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
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
    responseHandler(['OK', 200, 'Success update rating', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Menu - Update Rating = ${error.message}`)
    responseHandler([false, 422, error.message, []], res)
  }
}

export const updateMenuGroup = async (req: Request, res: Response) => {
  const id: string = req.params.id
  req.body.updatedAt = timestamps()

  const { error, value } = updateMenuGroupValidation(req.body)

  if (error) {
    logger.error(`ERROR: Menu - Update Menu Group = ${error.details[0].message}`)
    return responseHandler([false, 422, error.details[0].message, []], res)
  }

  try {
    await updateMenuGroupFromDB(id, value)

    logger.info('Success update menu group')
    responseHandler(['OK', 200, 'Success update menu group', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Menu - Update Menu Group = ${error.message}`)
    responseHandler([false, 422, error.message, []], res)
  }
}

export const updateMenusInGroup = async (req: Request, res: Response) => {
  const id: string = req.params.id
  const option: string = req.params.option

  const collectID = async (payload: string[]) => {
    const newCollect: object[] = []
    for (let x = 0; x < payload.length; x++) {
      const { _id, uuid }: any = await findIDMenuByUuidFromDB(payload[x])
      newCollect.push({ menu: _id, uuid })
    }
    return newCollect
  }

  try {
    const { error, value } = updateMenusInGroupValidation(req.body)
    value.updatedAt = timestamps()

    if (error) {
      logger.error(`ERROR: Menu - Update Menus in Group = ${error.details[0].message}`)
      return responseHandler([false, 422, error.details[0].message, []], res)
    }

    const check: any = await findAllMenusInGroupByID(id)
    if (!check) {
      logger.error('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    if (option === 'remove') {
      const recollect: object[] = deleteFunc(value.menus, check.menus)

      await updateMenusInGroupFromDB(id, recollect)
    } else if (option === 'add') {
      const collectPayload: object[] = await collectID(value.menus)
      const recollect: object[] = addFunc(collectPayload, check.menus)

      await updateMenusInGroupFromDB(id, recollect)
    } else {
      logger.error('ERROR: Menu - Update Menus in Group = Please type option "add" or "remove" and try request again')
      responseHandler([false, 422, 'Please type option "add" or "remove"', []], res)
    }

    logger.info('Success update menus in group')
    responseHandler(['OK', 200, 'Success update menus in group', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Menu - Update Menus in Group = ${error.message}`)
    responseHandler([false, 422, error.message, []], res)
  }
}
/* ###################### DELETE ########################### */
export const deleteMenuByID = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    const check: any = await deleteMenu(id)
    if (!check) {
      logger.info('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    // Also delete in groups if exists
    const getAllGroups = await findAllMenusInAllGroups()

    let x
    for (x = 0; x < getAllGroups.length; x++) {
      const group: any = getAllGroups[x]

      const recollect: object[] = deleteFunc([id], group.menus)
      await updateMenusInGroupFromDB(group.uuid, recollect)
    }

    logger.info('Success delete menu')
    return responseHandler(['OK', 200, 'Success delete menu', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Menu - Delete = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}

export const deleteMenuGroupByID = async (req: Request, res: Response) => {
  const id: string = req.params.id
  try {
    const result = await deleteGroup(id)
    if (!result) {
      logger.info('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    logger.info('Success delete menu group')
    return responseHandler(['OK', 200, 'Success delete menu group', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Menu - Delete Menu Group = ${error.message}`)
    return responseHandler([false, 422, error.message, []], res)
  }
}
