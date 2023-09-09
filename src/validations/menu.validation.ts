import Joi from 'joi'
import { type MenuCategoryType, type MenuRatingsType, type MenuType } from '../types/menu.type'

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
    type: Joi.object().required(),
    menuType: Joi.required(),
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

export const createMenuTypeValidation = (payload: MenuCategoryType) => {
  const schema = Joi.object({
    _id: Joi.required(),
    uuid: Joi.string().required(),
    menu: Joi.required(),
    categoryImage: Joi.string().allow('', null),
    subCategoryImage: Joi.string().allow('', null),
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
    createdAt: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

// update
export const updateMenuValidation = (payload: MenuType) => {
  const schema = Joi.object({
    uuidMenu: Joi.string().required(),
    name: Joi.string().allow('', null),
    image: Joi.string().allow('', null),
    contents: Joi.array().allow('', null),
    price: Joi.number().allow('', null),
    sold: Joi.string().allow('', null),
    ratings: Joi.object().allow('', null),
    type: Joi.object().allow('', null),
    menuType: Joi.allow('', null),
    menuRatings: Joi.allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const updateMenuRatingsValidation = (payload: MenuRatingsType) => {
  const schema = Joi.object({
    rate: Joi.number().allow('', null),
    comment: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const updateMenuTypeValidation = (payload: MenuCategoryType) => {
  const schema = Joi.object({
    category: Joi.string().allow('', null),
    subCategory: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}
