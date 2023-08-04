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
  access: { type: Schema.Types.ObjectId, ref: 'userAccess' },
  contact: { type: Schema.Types.ObjectId, ref: 'userContact' },
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
    ref: 'userdata'
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
    ref: 'userData'
  },
  email: {
    type: String,
    default: '-'
  },
  phone: {
    type: String,
    default: '-'
  },
  createdAt: String,
  updatedAt: String
})

export const AccessDocumentModel = mongoose.model('userAccess', accessDocumentSchema, 'userAccess')
export const ContactDocumentModel = mongoose.model('userContact', contactDocumentSchema, 'userContact')
export const UserDocumentModel = mongoose.model('userData', userDocumentSchema, 'userData')
