import { type Types } from 'mongoose'
export interface MenuType {
  _id: Types.ObjectId
  uuid: string
  menuCode: string
  name: string
  image: string
  contents: string
  price: number
  sold: number
  menuRatings: any
  ratings: object
  createdAt: string
  updatedAt: string
}

export interface MenuRatingsType {
  _id: Types.ObjectId
  uuid: string
  menu: string
  user: string
  rate: number
  comment: string
  createdAt: string
  updatedAt: string
}

export interface MenuGroupType {
  _id: Types.ObjectId
  uuid: string
  groupName: string
  image: string
  menus: string[]
  showOn: boolean
  createdAt: string
  updatedAt: string
}

export interface MenusValueGroup {
  menus: string[]
}
