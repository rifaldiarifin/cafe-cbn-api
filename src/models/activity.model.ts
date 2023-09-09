import mongoose, { Schema } from 'mongoose'

const activitySchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true
  },
  user: { type: Schema.Types.ObjectId, ref: 'userData' },
  title: String,
  createdAt: String,
  updatedAt: String
})

export const ActivityDocumentModel = mongoose.model('activityData', activitySchema, 'activityData')
