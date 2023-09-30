import { type Types } from 'mongoose'
export interface ActivityType {
  _id: Types.ObjectId
  uuid: string
  user: {
    data: Types.ObjectId
    fullname: string
  }
  activity: string
  createdAt: string
  updatedAt: string
}
