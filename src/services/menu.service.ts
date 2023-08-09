import { type MenuCategoryType, type MenuRatingsType, type MenuType } from '../types/menu.type'
import { MenuDocumentModel, RatingsDocumentModel, CategoryTypeDocumentModel } from '../models/menu.model'

// CREATE
export const createMenu = async (payload: MenuType) => {
  return await new MenuDocumentModel(payload).save()
}

export const createMenuRatings = async (payload: MenuRatingsType) => {
  return await new RatingsDocumentModel(payload).save()
}

export const createMenuType = async (payload: MenuCategoryType) => {
  return await new CategoryTypeDocumentModel(payload).save()
}

// READ
export const findMenuFromDB = async () => {
  return await MenuDocumentModel.find()
    .populate('menuRatings', '-_id rate comment')
    .populate('menuType', '-_id category subCategory')
    .select('_id uuid menuCode name image contents price sold createdAt updatedAt')
}

export const findMenuByIDFromDB = async (uuid: string) => {
  return await MenuDocumentModel.findOne({ uuid })
    .populate('menuRatings', '-_id rate comment')
    .populate('menuType', '-_id category subCategory')
    .select('_id uuid menuCode name image contents price sold createdAt updatedAt')
}

export const findMenuOnlyByIDFromDB = async (uuid: string) => {
  return await MenuDocumentModel.findOne({ uuid }).select(
    '_id uuid menuCode name image contents price sold menuRatings menuType createdAt updatedAt'
  )
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

export const updateMenuType = async (id: string, payload: MenuCategoryType) => {
  return await CategoryTypeDocumentModel.updateOne({ menu: id }, { $set: payload })
}

// DELETE
export const deleteMenu = async (id: string) => {
  const menu: any = await MenuDocumentModel.findOneAndDelete({ uuid: id }).select('_id')
  if (!menu) return false
  await RatingsDocumentModel.deleteMany({ menu: menu._id })
  await CategoryTypeDocumentModel.deleteOne({ menu: menu._id })

  return menu
}
