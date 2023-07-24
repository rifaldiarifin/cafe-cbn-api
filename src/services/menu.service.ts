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
  return await MenuDocumentModel.find().populate('menuRatings').populate('menuType').exec()
}

export const findMenuByIDFromDB = async (uuid: string) => {
  return await MenuDocumentModel.findOne({ uuid }).populate('menuRatings').populate('menuType').exec()
}

export const findMenuOnlyByIDFromDB = async (uuid: string) => {
  return await MenuDocumentModel.findOne({ uuid })
}

export const findRatingsOnlyByIDFromDB = async (uuid: string) => {
  return await RatingsDocumentModel.findOne({ uuid })
}

export const findAllRatingsOnlyByIDFromDB = async (id: string) => {
  return await RatingsDocumentModel.find({ menu: id })
}

// UPDATE
export const updateMenuFromDB = async (id: string, payload: MenuType) => {
  return await MenuDocumentModel.updateOne({ _id: id }, { $set: payload })
}

export const updateMenuRatings = async (id: string, payload: MenuRatingsType) => {
  return await RatingsDocumentModel.updateOne({ _id: id }, { $set: payload })
}

export const updateMenuType = async (id: string, payload: MenuCategoryType) => {
  return await CategoryTypeDocumentModel.updateOne({ menu: id }, { $set: payload })
}

// DELETE
export const deleteMenu = async (id: string) => {
  const menu = await MenuDocumentModel.findOneAndDelete({ _id: id })
  const rate = await RatingsDocumentModel.deleteMany({ menu: id })
  const type = await CategoryTypeDocumentModel.findOneAndDelete({ menu: id })

  return { menu, rate, type }
}
