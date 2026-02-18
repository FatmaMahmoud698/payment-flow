const { paymentStatus } = require('../../config');
const db = require('../../models');
const { createMockCheckout } = require('./third_party/paymentMock');

exports.createCheckout = async ({ body, idempotencyKey }) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { userId, amount, currency } = body;
    const existPayment = await db.Payment.findOne({ where: { idempotencyKey }, transaction });
    if (existPayment) {
      await transaction.rollback();
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
    }, { transaction });
    const { id: paymentId } = paymentData.toJSON();
    const {data, err} = await createMockCheckout({amount, currency, metaData: { paymentId, userId }});
    if (err) {
      await transaction.rollback();
      return { err, status: 500 };
    }
    await paymentData.update({ gatewayPaymentId: data.gatewayPaymentId, status: paymentStatus.pending }, { transaction });
    await transaction.commit();
    return { message: 'Checkout created successfully', data: {paymentId, checkoutUrl: data.checkoutUrl } };
  } catch (error) {
    if (transaction) await transaction.rollback();
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
