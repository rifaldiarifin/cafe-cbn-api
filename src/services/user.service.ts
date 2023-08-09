import { type UserType, type UserAccessType, type UserContactType } from '../types/user.type'
import { AccessDocumentModel, ContactDocumentModel, UserDocumentModel } from '../models/user.model'

/* ###################### CREATE ########################### */
export const createUser = async (payload: UserType) => {
  return await UserDocumentModel.create(payload)
}

export const createUserAccess = async (payload: UserAccessType) => {
  return await AccessDocumentModel.create(payload)
}

export const createUserContact = async (payload: UserContactType) => {
  return await ContactDocumentModel.create(payload)
}

/* ###################### READ ########################### */
export const findUsersFromDB = async () => {
  return await UserDocumentModel.find()
    .populate('access', '-_id role shift')
    .populate('contact', '-_id email phone')
    .select('_id uuid firstname lastname username password profileImage createdAt updatedAt')
}

export const findUserByID = async (uuid: string) => {
  return await UserDocumentModel.findOne({ uuid })
    .populate('access', '-_id role shift')
    .populate('contact', '-_id email phone')
    .select('_id uuid firstname lastname username password profileImage createdAt updatedAt')
}

export const findIdUserByUuid = async (uuid: string) => {
  return await UserDocumentModel.findOne({ uuid }).select('_id')
}

/* ###################### UPDATE ########################### */
export const updateUserByID = async (id: string, payload: UserType) => {
  return await UserDocumentModel.updateOne({ _id: id }, { $set: payload })
}

export const updateAccessUserByID = async (id: string, payload: UserAccessType) => {
  return await AccessDocumentModel.updateOne({ user: id }, { $set: payload })
}

export const updateContactUserByID = async (id: string, payload: UserContactType) => {
  return await ContactDocumentModel.updateOne({ user: id }, { $set: payload })
}

/* ###################### DELETE ########################### */
export const deleteUserByID = async (id: string) => {
  const user: any = await UserDocumentModel.findOneAndDelete({ uuid: id }).select('_id')
  if (!user) return false
  await AccessDocumentModel.deleteOne({ user: user._id })
  await ContactDocumentModel.deleteOne({ user: user._id })
  return user
}
