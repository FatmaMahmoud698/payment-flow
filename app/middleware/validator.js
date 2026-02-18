const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true, useDefaults: true });
require('ajv-errors')(ajv, { singleError: true });

const validate = (schema) => (req, res, next) => {
  const { body, params, query } = req;
  const validateSchema = ajv.compile(schema);
  const valid = validateSchema({ body, params, query });
  if (valid) {
    return next();
  }

  const errs = [];
  validateSchema.errors.forEach((err) => {
    if (err.message) errs.push(err.message);
  });
  return res.status(400).json(errs);
};

module.exports = { validate };