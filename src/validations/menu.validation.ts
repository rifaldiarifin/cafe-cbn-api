import Joi from 'joi'
import { type MenusValueGroup, type MenuGroupType, type MenuRatingsType, type MenuType } from '../types/menu.type'

// create
export const createMenuValidation = (payload: MenuType) => {
  const schema = Joi.object({
    _id: Joi.required(),
    uuid: Joi.string().required(),
    menuCode: Joi.string().required(),
    name: Joi.string().required(),
    image: Joi.string().allow('', null),
    contents: Joi.string().allow('', null),
    price: Joi.number().required(),
    sold: Joi.string().allow('', null),
    menuRatings: Joi.allow('', null),
    createdAt: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const createMenuRatingsValidation = (payload: MenuRatingsType) => {
  const schema = Joi.object({
    _id: Joi.required(),
    uuid: Joi.string().required(),
    menu: Joi.required(),
    user: Joi.required(),
    rate: Joi.number().required(),
    comment: Joi.string().allow('', null),
    createdAt: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const createMenuGroupValidation = (payload: MenuGroupType) => {
  const schema = Joi.object({
    _id: Joi.required(),
    uuid: Joi.string().required(),
    groupName: Joi.string().required(),
    image: Joi.string().allow('', null),
    menus: Joi.array().allow('', null),
    showOn: Joi.boolean().allow('', null),
    createdAt: Joi.string().required(),
    updatedAt: Joi.string().required()
  })

  return schema.validate(payload)
}

// update
export const updateMenusInGroupValidation = (payload: MenusValueGroup) => {
  const schema = Joi.object({
    menus: Joi.array().required()
  })

  return schema.validate(payload)
}
export const updateShowInGroupValidation = (payload: MenuGroupType) => {
  const schema = Joi.object({
    showOn: Joi.boolean().required()
  })

  return schema.validate(payload)
}
export const updateMenuValidation = (payload: MenuType) => {
  const schema = Joi.object({
    uuidMenu: Joi.string().required(),
    name: Joi.string().allow('', null),
    image: Joi.string().allow('', null),
    contents: Joi.string().allow('', null),
    price: Joi.number().allow('', null),
    sold: Joi.string().allow('', null),
    ratings: Joi.object().allow('', null),
    menuRatings: Joi.allow('', null),
    updatedAt: Joi.string().required()
  })

  return schema.validate(payload)
}

export const updateMenuRatingsValidation = (payload: MenuRatingsType) => {
  const schema = Joi.object({
    rate: Joi.number().allow('', null),
    comment: Joi.string().allow('', null),
    updatedAt: Joi.string().required()
  })

  return schema.validate(payload)
}

export const updateMenuGroupValidation = (payload: MenuGroupType) => {
  const schema = Joi.object({
    groupName: Joi.string().allow(null),
    image: Joi.string().allow(null),
    showOn: Joi.boolean().allow(null),
    updatedAt: Joi.string().required()
  })

  return schema.validate(payload)
}

// validate string
export const createValidateString = (payload: any) => {
  const schema = Joi.object({
    category: Joi.string().allow('', null),
    subcategory: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}
