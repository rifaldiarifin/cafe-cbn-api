import { UserDocumentModel } from '../models/user.model'

export const findUserByUsername = async (username: string) => {
  return await UserDocumentModel.findOne({ username }).populate('personalAccess').populate('personalContact').exec()
}
