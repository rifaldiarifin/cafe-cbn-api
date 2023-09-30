import { type Types } from 'mongoose'

export interface UserType {
  _id: Types.ObjectId
  uuid: string
  firstname: string
  lastname: string
  username: string
  password: string
  profileImage: string
  access: object
  contact: object
  createAt: Date
  updateAt: Date
}

export interface UserAccessType {
  _id: Types.ObjectId
  uuid: string
  user: string
  role: string
  createAt: Date
  updateAt: Date
}

export interface UserContactType {
  _id: Types.ObjectId
  uuid: string
  user: string
  email: string
  phone: string
  createAt: Date
  updateAt: Date
}
