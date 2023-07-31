import Joi from 'joi'
import { type UserAccessType, type UserContactType, type UserType } from '../types/user.type'

export const createUserValidation = (payload: UserType) => {
  const schema = Joi.object({
    _id: Joi.required(),
    uuid: Joi.required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    profileImage: Joi.string().allow('', null),
    userAccess: Joi.object().required(),
    userContact: Joi.object().required(),
    access: Joi.required(),
    contact: Joi.required(),
    createdAt: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const createAccessUserValidation = (payload: UserAccessType) => {
  const schema = Joi.object({
    _id: Joi.required(),
    uuid: Joi.required(),
    user: Joi.required(),
    role: Joi.string().allow('', null),
    shift: Joi.string().allow('', null),
    createdAt: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const createContactUserValidation = (payload: UserContactType) => {
  const schema = Joi.object({
    _id: Joi.required(),
    uuid: Joi.required(),
    user: Joi.required(),
    email: Joi.string().allow('', null),
    phone: Joi.string().allow('', null),
    createdAt: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const updateUserValidation = (payload: UserType) => {
  const schema = Joi.object({
    firstname: Joi.string().allow('', null),
    lastname: Joi.string().allow('', null),
    username: Joi.string().allow('', null),
    password: Joi.string().allow('', null),
    profileImage: Joi.string().allow('', null),
    access: Joi.object().allow('', null),
    contact: Joi.object().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const updateAccessUserValidation = (payload: UserAccessType) => {
  const schema = Joi.object({
    role: Joi.string().allow('', null),
    shift: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const updateContactUserValidation = (payload: UserContactType) => {
  const schema = Joi.object({
    email: Joi.string().allow('', null),
    phone: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const createSessionValidation = (payload: UserType) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })

  return schema.validate(payload)
}

export const refreshSessionValidation = (payload: string) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required()
  })

  return schema.validate(payload)
}
