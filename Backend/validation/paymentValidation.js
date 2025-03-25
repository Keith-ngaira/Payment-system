import Joi from 'joi';

export const paypalSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('USD')
});

export const mpesaSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^254[0-9]{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be in the format 254XXXXXXXXX'
    }),
  amount: Joi.number().positive().required()
});

export const airtelSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^254[0-9]{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be in the format 254XXXXXXXXX'
    }),
  amount: Joi.number().positive().required()
});

export const cardSchema = Joi.object({
  cardDetails: Joi.object({
    number: Joi.string()
      .pattern(/^[0-9]{16}$/)
      .required()
      .messages({
        'string.pattern.base': 'Card number must be 16 digits'
      }),
    expiry: Joi.string()
      .pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)
      .required()
      .messages({
        'string.pattern.base': 'Expiry date must be in the format MM/YY'
      }),
    cvc: Joi.string()
      .pattern(/^[0-9]{3,4}$/)
      .required()
      .messages({
        'string.pattern.base': 'CVC must be 3 or 4 digits'
      }),
    name: Joi.string().required()
  }).required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('USD')
});

export const mobileConfirmationSchema = Joi.object({
  provider: Joi.string().valid('mpesa', 'airtel').required(),
  transactionId: Joi.string().required()
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    next();
  };
};
