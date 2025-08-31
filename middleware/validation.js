const Joi = require('joi');

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'string.min': 'Password must be at least 8 characters long'
      }),
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  
  updateUser: Joi.object({
    name: Joi.string().trim().min(2).max(50),
    email: Joi.string().email(),
  }),
  
  task: Joi.object({
    title: Joi.string().trim().min(1).max(200).required(),
    description: Joi.string().max(1000).allow(''),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
    dueDate: Joi.date().iso(),
    category: Joi.string().max(50).allow(''),
  }),
  
  event: Joi.object({
    title: Joi.string().trim().min(1).max(200).required(),
    description: Joi.string().max(1000).allow(''),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    allDay: Joi.boolean().default(false),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).allow(''),
  }),
  
  note: Joi.object({
    title: Joi.string().trim().min(1).max(200).required(),
    content: Joi.string().required(),
    category: Joi.string().max(50).allow(''),
    tags: Joi.array().items(Joi.string().max(30)).max(10),
  }),
};

// Validation middleware factory
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Validation schema not found',
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    req.body = value;
    next();
  };
};

module.exports = { validate, schemas };