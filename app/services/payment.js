const { paymentStatus } = require('../../config');
const db = require('../../models');
const { createMockCheckout } = require('./third_party/paymentMock');

exports.createCheckout = async ({ body, idempotencyKey }) => {
  try {
    const { userId, amount, currency } = body;
    const existPayment = await db.Payment.findOne({ where: { idempotencyKey } });
    if (existPayment) {
      if (existPayment.gatewayPaymentId) {
        const checkoutUrl = `${process.env.EXTERNAL_GATEWAY_URL}/mock/checkout/${existPayment.gatewayPaymentId}`;
        return { 
          message: 'Checkout already exists', 
          data: { paymentId: existPayment.id, checkoutUrl } 
        };
      }

      return { 
        message: 'Payment is currently being processed by the gateway. Please try again in a few seconds.', 
        status: 202,
        data: { paymentId: existPayment.id, checkoutUrl: null }
      };
    }
    const paymentData = await db.Payment.create({
      userId,
      amount,
      currency: currency,
      idempotencyKey,
      status: paymentStatus.created
    });
    const { id: paymentId } = paymentData;
    processGatewayCheckout({ paymentId, amount, currency, userId });
    return { message: 'Payment request accepted. You will receive an email with the checkout link within 30 minutes.', data: { paymentId, checkoutUrl: null } };
  } catch (error) {
    return { err: error.message || 'Failed to create checkout', status: error.status || 500};
  }
};

exports.getPaymentDetails = async ({ params }) => {
  try {
    const { id } = params;
    const payment = await db.Payment.findOne({
      where: { id },
      include: [{model: db.LedgerEntry, as: 'ledgerEntries'}],
    });

    if (!payment) {
      return { err: 'Payment not found', status: 404 };
    }
    return { message: 'Payment details retrieved successfully', data: payment };
  } catch (error) {
    return { err: error.message || 'Failed to get payment details', status: error.status || 500 };
  }
};


async function processGatewayCheckout({ paymentId, amount, currency, userId }) {
  try {
    const { data, err } = await createMockCheckout({ amount, currency, metaData: { paymentId, userId } });

    if (err) {
      await db.Payment.update({ status: paymentStatus.failed }, { where: { id: paymentId } });
      return;
    }
    await db.Payment.update({ gatewayPaymentId: data.gatewayPaymentId, status: paymentStatus.pending },
      { where: { id: paymentId } });
    const checkoutUrl = `${process.env.EXTERNAL_GATEWAY_URL}/mock/checkout/${data.gatewayPaymentId}`;
    await db.Outbox.create({
      type: 'PAYMENT_LINK_EMAIL',
      paymentId: paymentId,
      payload: {
        email: `${userId}@example.com`,
        checkoutUrl: checkoutUrl,
        amount: amount,
        currency: currency
      },
      status: 'PENDING',
      nextAttemptAt: new Date()
    });
  } catch (error) {
    await db.Payment.update({ status: paymentStatus.failed }, { where: { id: paymentId } });
  }
}