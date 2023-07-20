import mongoose, { Schema } from 'mongoose'

const userDocumentSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: String,
    unique: true
  },
  firstname: String,
  lastname: String,
  username: {
    type: String,
    unique: true
  },
  password: String,
  profileImage: {
    type: String,
    default: 'noavatar.jpg'
  },
  personalAccess: { type: Schema.Types.ObjectId, ref: 'personalAccess' },
  personalContact: { type: Schema.Types.ObjectId, ref: 'personalContact' },
  createdAt: String,
  updatedAt: String
})

const accessDocumentSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: String,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'personaldata'
  },
  role: {
    type: String,
    default: 'cashier'
  },
  shift: {
    type: String,
    default: '-'
  },
  createdAt: String,
  updatedAt: String
})

const contactDocumentSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: String,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'personalData'
  },
  email: {
    type: String,
    unique: true,
    default: '-'
  },
  phone: {
    type: String,
    default: '-'
  },
  createdAt: String,
  updatedAt: String
})

export const AccessDocumentModel = mongoose.model('personalAccess', accessDocumentSchema, 'personalAccess')
export const ContactDocumentModel = mongoose.model('personalContact', contactDocumentSchema, 'personalContact')
export const UserDocumentModel = mongoose.model('personalData', userDocumentSchema, 'personalData')
