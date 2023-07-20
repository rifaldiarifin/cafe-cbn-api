import { type UserType, type UserAccessType, type UserContactType } from '../types/user.type'
import { AccessDocumentModel, ContactDocumentModel, UserDocumentModel } from '../models/user.model'
export const createUser = async (payload: UserType) => {
  return await new UserDocumentModel(payload).save()
}

export const createUserAccess = async (payload: UserAccessType) => {
  return await new AccessDocumentModel(payload).save()
}

export const createUserContact = async (payload: UserContactType) => {
  return await new ContactDocumentModel(payload).save()
}

export const getUsersFromDB = async () => {
  return await UserDocumentModel.find().populate('personalAccess').populate('personalContact').exec()
}

export const findUserByID = async (uuid: string) => {
  return await UserDocumentModel.findOne({ uuid }).populate('personalAccess').populate('personalContact').exec()
}

export const updateUserByID = async (id: string, payload: UserType) => {
  return await UserDocumentModel.updateOne({ _id: id }, { $set: payload })
}

export const updateAccessUserByID = async (id: string, payload: UserAccessType) => {
  return await AccessDocumentModel.updateOne({ user: id }, { $set: payload })
}

export const updateContactUserByID = async (id: string, payload: UserContactType) => {
  return await ContactDocumentModel.updateOne({ user: id }, { $set: payload })
}

export const deleteUserByID = async (id: string) => {
  const user = await UserDocumentModel.findOneAndDelete({ _id: id })
  const access = await AccessDocumentModel.findOneAndDelete({ user: id })
  const contact = await ContactDocumentModel.findOneAndDelete({ user: id })
  return {
    user,
    access,
    contact
  }
}
