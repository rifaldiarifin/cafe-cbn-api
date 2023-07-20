export interface UserType {
  _id: string
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
  _id: string
  uuid: string
  user: string
  role: string
  shift: string
  createAt: Date
  updateAt: Date
}

export interface UserContactType {
  _id: string
  uuid: string
  user: string
  email: string
  phone: string
  createAt: Date
  updateAt: Date
}
