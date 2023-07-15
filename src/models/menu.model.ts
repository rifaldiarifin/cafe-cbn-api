import mongoose from 'mongoose'

const menuSchema = new mongoose.Schema({
  productCode: {
    type: String,
    unique: true
  },
  productName: {
    type: String
  },
  image: {
    type: String
  },
  price: {
    type: Number
  },
  totalSold: {
    type: Number
  },
  createdAt: {
    type: String
  },
  updateAt: {
    type: String
  }
})

const menuModel = mongoose.model('menu', menuSchema)

export default menuModel
