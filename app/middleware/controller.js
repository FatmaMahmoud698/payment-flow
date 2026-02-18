const { ServerError } = require('../../utils/core');

exports.controller = (service) => async (req, res, next) => {
  const { err, status, message, meta, data } = await service(req);
  if (err) return next(new ServerError(err, status));
  return res.json({ message, meta, data });
};
