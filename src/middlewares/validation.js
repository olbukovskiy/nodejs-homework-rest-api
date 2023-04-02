const Joi = require("joi");
const checkFieldType = require("../helpers/selectMissingKey");
const { ValidationError } = require("../helpers/errors");

const getSchema = Joi.object({
  favorite: Joi.boolean(),
});

const postSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string().required(),
});

const putSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string(),
}).min(1);

const patchSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const patchUserSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const usersSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().required(),
  subscription: Joi.string(),
  token: Joi.string(),
});

const verifySchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

const getAllPostsValidation = (req, res, next) => {
  const validation = getSchema.validate({ ...req.query });

  if (validation.error) {
    throw new ValidationError(`inappropriate request query type`);
  }

  next();
};

const addPostValidation = (req, res, next) => {
  const validation = postSchema.validate({ ...req.body });
  if (validation.error) {
    const missingFields = checkFieldType(validation.error.details[0].message);
    throw new ValidationError(`missing required ${missingFields} field`);
  }

  next();
};

const addPutValidation = (req, res, next) => {
  const validation = putSchema.validate({ ...req.body });

  if (validation.error) {
    throw new ValidationError("missing fields");
  }

  next();
};

const addPatchValidation = (req, res, next) => {
  const validation = patchSchema.validate({ ...req.body });

  if (validation.error) {
    throw new ValidationError("missing field favorite");
  }

  next();
};

const authValidation = (req, res, next) => {
  const validation = usersSchema.validate({ ...req.body });

  if (validation.error) {
    const missingFields = checkFieldType(validation.error.details[0].message);
    throw new ValidationError(`missing required ${missingFields} field`);
  }

  next();
};

const userPatchValidation = (req, res, next) => {
  const validation = patchUserSchema.validate({
    subscription: req.body.subscription,
  });

  if (validation.error) {
    throw new ValidationError("Non-existent subscription type");
  }

  next();
};

const validateVerifyData = (req, res, next) => {
  const validation = verifySchema.validate({ email: req.body.email });

  if (validation.error) {
    throw new ValidationError("missing required field email");
  }

  next();
};

module.exports = {
  addPostValidation,
  addPutValidation,
  addPatchValidation,
  authValidation,
  userPatchValidation,
  getAllPostsValidation,
  validateVerifyData,
};
