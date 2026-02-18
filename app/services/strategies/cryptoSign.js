const crypto = require('crypto');

function generateSignature(payload, secret) {
  return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
}

function verifySignature(payload, signature, secret) {
  const expectedSignature = generateSignature(payload, secret);
  
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

function generatePaymentReference() {
  return `PAY_${crypto.randomBytes(16).toString('hex').toUpperCase()}`;
}

module.exports = {
  generateSignature,
  verifySignature,
  generatePaymentReference
};