const dotenv = require('dotenv');

const envFound = dotenv.config();
if (!envFound) {
  throw new Error(' Couldn\'t find .env file!');
}

module.exports = {
  port: parseInt(process.env.PORT, 10),
  serverUrl: process.env.SERVER_URL,
  webhookSecret: process.env.WEBHOOK_SECRET,
  paymentStatus: {
    created: 'CREATED',
    pending: 'PENDING',
    authorized: 'AUTHORIZED',
    captured: 'CAPTURED',
    failed: 'FAILED',
    refunded: 'REFUNDED',
  },
  outboxStatus: {
    pending: 'PENDING',
    sent: 'SENT',
    failed: 'FAILED',
  }
};
