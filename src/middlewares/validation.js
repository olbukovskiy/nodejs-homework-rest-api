const Joi = require("joi");
const checkFieldType = require("../helpers/selectMissingKey");

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

const addPostValidation = (req, res, next) => {
  const validation = postSchema.validate({ ...req.body });
  if (validation.error) {
    const missingFields = checkFieldType(validation.error.details[0].message);
    return res
      .status(400)
      .json({ message: `missing required ${missingFields} field` });
  }

  next();
};

const addPutValidation = (req, res, next) => {
  const validation = putSchema.validate({ ...req.body });

  if (validation.error) {
    return res.status(400).json({ message: "missing fields" });
  }

  next();
};

const addPatchValidation = (req, res, next) => {
  const validation = patchSchema.validate({ ...req.body });

  if (validation.error) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  next();
};

module.exports = {
  addPostValidation,
  addPutValidation,
  addPatchValidation,
};
