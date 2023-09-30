import { type ActivityType } from '../types/activity.type'
import { ActivityDocumentModel } from '../models/activity.model'

// CREATE
export const addActivity = async (payload: ActivityType) => {
  return await ActivityDocumentModel.create(payload)
}

// READ
export const findActivityFromDB = async () => {
  return await ActivityDocumentModel.find()
    .populate('user.data', '-_id uuid firstname lastname username profileImage')
    .select('_id uuid user activity user createdAt updatedAt')
}

export const findMyActivityFromDB = async (user: string) => {
  return await ActivityDocumentModel.find({ 'user.data': user })
    .populate('user.data', '-_id uuid firstname lastname username profileImage')
    .select('_id uuid user activity user createdAt updatedAt')
}

export const findActivityByIDFromDB = async (uuid: string) => {
  return await ActivityDocumentModel.findOne({ uuid })
    .populate('user.data', '-_id uuid firstname lastname username profileImage')
    .select('_id uuid user activity user createdAt updatedAt')
}

// UPDATE
export const updateActivityByID = async (payload: ActivityType) => {
  return await ActivityDocumentModel.updateOne(payload)
}

// DELETE
export const deleteActivityByID = async (uuid: string) => {
  return await ActivityDocumentModel.findOneAndDelete({ uuid })
}
