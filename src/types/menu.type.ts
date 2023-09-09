export interface MenuType {
  _id: string
  uuid: string
  menuCode: string
  name: string
  image: string
  contents: string
  price: number
  sold: number
  menuRatings: any
  ratings: object
  type: object
  createdAt: string
  updatedAt: string
}

export interface MenuRatingsType {
  _id: string
  uuid: string
  menu: string
  user: string
  rate: number
  comment: string
  createdAt: string
  updatedAt: string
}

export interface MenuCategoryType {
  _id: string
  uuid: string
  menu: string
  categoryImage: string
  subCategoryImage: string
  category: string
  subCategory: string
  createdAt: string
  updatedAt: string
}
