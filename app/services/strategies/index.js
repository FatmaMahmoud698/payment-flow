const { webhookSecret } = require("../../../config");
const { verifySignature } = require("./cryptoSign");

module.exports = {
  idempotencyKey: (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];
    
    if (!idempotencyKey) {
      return res.status(400).json({message: 'Missing Idempotency-Key header'});
    }

    if (idempotencyKey.length < 1 || idempotencyKey.length > 255) {
      return res.status(400).json({message: 'Idempotency-Key must be between 1 and 255 characters'});
    }

    req.idempotencyKey = idempotencyKey;
    next();
  },

  xSignature: (req, res, next) => {
    const signature = req.headers['x-signature'];
    if (!signature) {
      return res.status(401).json({message: 'Missing X-Signature header'});
    }
    try {
      const isValid = verifySignature(req.body, signature, webhookSecret);
      if (!isValid) {
        return res.status(401).json({message: 'Invalid signature'});
      }
      next();
    } catch (error) {
      return res.status(401).json({message: 'Signature verification failed'});
    }
  }
};
