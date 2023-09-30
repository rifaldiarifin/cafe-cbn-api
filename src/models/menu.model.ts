import mongoose, { Schema } from 'mongoose'

const menuSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: String,
    unique: true
  },
  menuCode: {
    type: String,
    unique: true
  },
  name: String,
  image: {
    type: String,
    default: 'nofoodphoto'
  },
  contents: {
    type: String,
    default: '-'
  },
  price: {
    type: Number
  },
  sold: {
    type: Number,
    default: 0
  },
  menuRatings: [{ type: Schema.Types.ObjectId, ref: 'menuRatings' }],
  createdAt: String,
  updatedAt: String
})

const menuRatingsSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: String,
    unique: true
  },
  menu: { type: Schema.Types.ObjectId, ref: 'menuData' },
  user: { type: Schema.Types.ObjectId, ref: 'personalData' },
  rate: {
    type: Number,
    default: 0
  },
  comment: {
    type: String,
    default: ''
  },
  createdAt: String,
  updatedAt: String
})

const menuGroupSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: String,
    unique: true
  },
  groupName: {
    type: String,
    unique: true
  },
  image: {
    type: String,
    default: 'nofoodphoto'
  },
  menus: [
    {
      menu: { type: Schema.Types.ObjectId, ref: 'menuData' },
      uuid: String
    }
  ],
  showOn: {
    type: Boolean,
    default: false
  },
  createdAt: String,
  updatedAt: String
})

export const RatingsDocumentModel = mongoose.model('menuRatings', menuRatingsSchema, 'menuRatings')
export const GroupDocumentModel = mongoose.model('menuType', menuGroupSchema, 'menuGroups')
export const MenuDocumentModel = mongoose.model('menuData', menuSchema, 'menuData')
