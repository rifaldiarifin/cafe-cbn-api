import { type ActivityType } from '../types/activity.type'
import { ActivityDocumentModel } from '../models/activity.model'

// CREATE
export const addActivity = async (payload: ActivityType) => {
  return await ActivityDocumentModel.create(payload)
}

// READ
export const findActivityFromDB = async () => {
  return await ActivityDocumentModel.find().select('_id uuid user title description createdAt updatedAt')
}

export const findActivityByIDFromDB = async (uuid: string) => {
  return await ActivityDocumentModel.findOne({ uuid })
}

// UPDATE
export const updateActivityByID = async (payload: ActivityType) => {
  return await ActivityDocumentModel.updateOne(payload)
}

// DELETE
export const deleteActivityByID = async (uuid: string) => {
  return await ActivityDocumentModel.findOneAndDelete({ uuid })
}
