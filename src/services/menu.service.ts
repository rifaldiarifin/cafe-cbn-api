import { type MenuGroupType, type MenuRatingsType, type MenuType } from '../types/menu.type'
import { MenuDocumentModel, RatingsDocumentModel, GroupDocumentModel } from '../models/menu.model'

// CREATE
export const createMenu = async (payload: MenuType) => {
  return await MenuDocumentModel.create(payload)
}

export const createMenuRatings = async (payload: MenuRatingsType) => {
  return await RatingsDocumentModel.create(payload)
}

export const createMenuGroup = async (payload: MenuGroupType) => {
  return await GroupDocumentModel.create(payload)
}

// READ
export const findMenuFromDB = async () => {
  return await MenuDocumentModel.find()
    .populate('menuRatings', '-_id rate comment')
    .select('_id uuid menuCode name image contents price sold createdAt updatedAt')
}

export const findMenuGroupsFromDB = async () => {
  return await GroupDocumentModel.find()
    .populate('menus.menu', '-_id uuid menuCode name image contents price')
    .select('-_id uuid groupName image showOn createdAt updatedAt')
}

export const findMenuGroupsOnlyUuidMenusFromDB = async () => {
  return await GroupDocumentModel.find().select('-_id uuid groupName image menus.uuid showOn createdAt updatedAt')
}

export const findMenuGroupByIDFromDB = async (uuid: string) => {
  return await GroupDocumentModel.findOne({ uuid })
    .populate('menus.menu', '-_id uuid menuCode name image contents price')
    .select('-_id uuid groupName image showOn createdAt updatedAt')
}

export const findMenuGroupOnlyUuidMenusByIDFromDB = async (uuid: string) => {
  return await GroupDocumentModel.findOne({ uuid }).select(
    '-_id uuid groupName image menus.uuid showOn createdAt updatedAt'
  )
}

export const findAllMenusInAllGroups = async () => {
  return await GroupDocumentModel.find().select('-_id uuid menus')
}

export const findAllMenusInGroupByID = async (uuid: string) => {
  return await GroupDocumentModel.findOne({ uuid }).select('-_id uuid menus')
}

export const findMenuByIDFromDB = async (uuid: string) => {
  return await MenuDocumentModel.findOne({ uuid })
    .populate('menuRatings', '-_id rate comment')
    .select('_id uuid menuCode name image contents price sold createdAt updatedAt')
}

export const findMenuOnlyByIDFromDB = async (uuid: string) => {
  return await MenuDocumentModel.findOne({ uuid }).select(
    '_id uuid menuCode name image contents price sold menuRatings menuType createdAt updatedAt'
  )
}

export const findIDMenuByUuidFromDB = async (uuid: string) => {
  return await MenuDocumentModel.findOne({ uuid }).select('_id uuid')
}

export const findRatingsOnlyByIDFromDB = async (uuid: string) => {
  return await RatingsDocumentModel.findOne({ uuid }).select('_id uuid menu user rate comment createdAt updatedAt')
}

export const findAllRatingsOnlyByUserFromDB = async (id: string) => {
  return await RatingsDocumentModel.find({ user: id }).select('_id uuid menu user rate comment createdAt updatedAt')
}

// UPDATE
export const updateMenuFromDB = async (id: string, payload: MenuType) => {
  return await MenuDocumentModel.updateOne({ _id: id }, { $set: payload })
}

export const updateSoldMenuFromDB = async (uuid: string, sold: number) => {
  return await MenuDocumentModel.updateOne({ uuid }, { $set: { sold } })
}

export const updateMenuRatings = async (id: string, payload: MenuRatingsType) => {
  return await RatingsDocumentModel.updateOne({ _id: id }, { $set: payload })
}

export const updateMenuGroupFromDB = async (id: string, payload: MenuGroupType) => {
  return await GroupDocumentModel.updateOne({ uuid: id }, { $set: payload })
}

export const updateMenusInGroupFromDB = async (id: string, payload: object[]) => {
  return await GroupDocumentModel.updateOne({ uuid: id }, { $set: { menus: payload } })
}

// DELETE
export const deleteMenu = async (id: string) => {
  const menu: any = await MenuDocumentModel.findOneAndDelete({ uuid: id }).select('_id')
  if (!menu) return false
  await RatingsDocumentModel.deleteMany({ menu: menu._id })

  return menu
}

export const deleteGroup = async (uuid: string) => {
  return await GroupDocumentModel.findOneAndDelete({ uuid }).select('uuid groupName')
}
