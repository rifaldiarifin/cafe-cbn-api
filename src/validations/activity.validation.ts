import Joi from 'joi'
import { type ActivityType } from '../types/activity.type'

export const createActivityValidation = (payload: ActivityType) => {
  const schema = Joi.object({
    uuid: Joi.string().required(),
    user: Joi.required(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null),
    createdAt: Joi.string().required(),
    updatedAt: Joi.string().required()
  })

  return schema.validate(payload)
}

export const updateActivityValidation = (payload: ActivityType) => {
  const schema = Joi.object({
    title: Joi.string().allow('', null),
    description: Joi.string().allow('', null),
    updatedAt: Joi.string().required()
  })

  return schema.validate(payload)
}
