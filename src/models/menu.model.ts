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
  name: {
    type: String,
    unique: true
  },
  image: {
    type: String,
    default: 'nofoodphoto.jpg'
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
  menuRatings: [{ type: Schema.Types.ObjectId, ref: 'menuRatings', default: {} }],
  menuType: { type: Schema.Types.ObjectId, ref: 'menuType' },
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

const menuTypeSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: String,
    unique: true
  },
  menu: { type: Schema.Types.ObjectId, ref: 'menuData' },
  categoryImage: String,
  subCategoryImage: String,
  category: String,
  subCategory: String,
  createdAt: String,
  updatedAt: String
})

export const RatingsDocumentModel = mongoose.model('menuRatings', menuRatingsSchema, 'menuRatings')
export const CategoryTypeDocumentModel = mongoose.model('menuType', menuTypeSchema, 'menuType')
export const MenuDocumentModel = mongoose.model('menuData', menuSchema, 'menuData')
