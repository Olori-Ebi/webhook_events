import Joi from 'joi'
import { AddressPayload, ProductPayload, SigninPayload, SignupPayload, Type } from '../payload';

const validateSignup = (payload: SignupPayload) => {
    const schema = Joi.object({
        phone: Joi.string().regex(/((\+?234)|080|070|090|081)\d{8}$/).required(),
        password: Joi.string().min(8).required(),
        email: Joi.string().email().required()
    });
    return schema.validate(payload, {allowUnknown: true});
  };

const validateSignin = (payload: SigninPayload) => {
    const schema = Joi.object({
        password: Joi.string().min(8).required(),
        email: Joi.string().email().required()
    });
    return schema.validate(payload, {allowUnknown: true});
  };

const validateAddress = (payload: AddressPayload) => {
    const schema = Joi.object({
        street: Joi.string().required(),
        postalCode: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
    });
    return schema.validate(payload, {allowUnknown: true});
  };

const validateProduct = (payload: ProductPayload) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().required(),
        banner: Joi.string().required(),
        type: Joi.string().required(),
        unit: Joi.number().required(),
        price: Joi.number().required(),
        available: Joi.boolean().required(),
        supplier: Joi.string().required(),
    });
    return schema.validate(payload, {allowUnknown: true});
  };

const validateType = (payload: Type) => {
    const schema = Joi.object({
      params: Joi.object({
        type: Joi.string().valid(Type.FRUITS, Type.OILS, Type.VEGETABLES).required(),
      })
        // params: Joi.string().valid(Type.FRUITS, Type.OILS, Type.VEGETABLES).required(),
    });
    return schema.validate(payload, {allowUnknown: true});
  };

  export default {validateSignup, validateSignin, validateAddress, validateProduct, validateType}