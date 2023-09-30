import Joi from 'joi'
import { type ActivityType } from '../types/activity.type'

export const createActivityValidation = (payload: ActivityType) => {
  const schema = Joi.object({
    uuid: Joi.string().required(),
    user: Joi.object({
      data: Joi.required(),
      fullname: Joi.string().required()
    }),
    activity: Joi.string().required(),
    createdAt: Joi.string().required(),
    updatedAt: Joi.string().required()
  })

  return schema.validate(payload)
}

export const updateActivityValidation = (payload: ActivityType) => {
  const schema = Joi.object({
    activity: Joi.string().allow('', null),
    updatedAt: Joi.string().required()
  })

  return schema.validate(payload)
}
