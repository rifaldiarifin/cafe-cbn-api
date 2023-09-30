import mongoose, { Schema } from 'mongoose'

const activitySchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true
  },
  user: {
    data: { type: Schema.Types.ObjectId, ref: 'userData' },
    fullname: String
  },
  activity: String,
  createdAt: String,
  updatedAt: String
})

export const ActivityDocumentModel = mongoose.model('activityData', activitySchema, 'activityData')
