import { UserDocumentModel } from '../models/user.model'

export const findUserByUsername = async (username: string) => {
  return await UserDocumentModel.findOne({ username })
    .populate('access', '-_id role shift')
    .populate('contact', '-_id email phone')
    .select('_id uuid firstname lastname username password profileImage createdAt updatedAt')
}
