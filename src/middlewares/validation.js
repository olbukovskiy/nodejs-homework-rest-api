const Joi = require("joi");

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

const addPostValidation = (req, res, next) => {
  const validation = postSchema.validate({ ...req.body });
  if (validation.error) {
    return res.status(400).json({ message: "missing required name field" });
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

module.exports = {
  addPostValidation,
  addPutValidation,
};
