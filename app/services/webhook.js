const db = require('../../models');

exports.processWebhookEvent = async ({ body }) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {eventId, eventType, payload} = body;
    const existingEvent = await db.WebhookEvent.findOne({ where: { eventId }, transaction });
    if (existingEvent) {
      await transaction.rollback();
      return { message: 'Event already processed', status: 200 };
    }
    const currentPayment = await db.Payment.findOne({ where: { gatewayPaymentId: payload.gatewayPaymentId }, transaction,
      lock: transaction.LOCK.UPDATE });
    if (!currentPayment) {
        await transaction.rollback();
        return { err: 'Payment not found for gateway payment ID', status: 404 };
    }
    const isValidTransition = _canTransitionToStatus(currentPayment.status, eventType);
    if (!isValidTransition) {
        await transaction.rollback();
        return { err: `Invalid status transition from ${currentPayment.status} to ${eventType}`, status: 400 };
    }
    await db.WebhookEvent.create({ eventId, type: eventType, payload, payment: 'mock' }, { transaction });
    await currentPayment.update({ status: eventType }, { transaction });

    if (eventType === 'CAPTURED') {
      await db.LedgerEntry.create({
        paymentId: currentPayment.id,
        userId: currentPayment.userId,
        amount: currentPayment.amount,
        currency: currentPayment.currency,
        direction: 'CREDIT',
        type: 'PAYMENT_CAPTURE',
      }, { transaction });

      await db.Outbox.create({
        type: 'RECEIPT_EMAIL',
        paymentId: currentPayment.id,
        payload: { paymentId: currentPayment.id, email: `${currentPayment.userId}@example.com` },
        status: 'PENDING',
        nextAttemptAt: new Date()
      }, { transaction });
    }

    await transaction.commit();
    return { message: 'Processed successfully' };

  } catch (error) {
    await transaction.rollback();
    return { err: error.message, status: 500 };
  }
}

function _canTransitionToStatus(currentStatus, newStatus) {
    const validTransitions = {
        CREATED: ['PENDING', 'FAILED'],
        PENDING: ['AUTHORIZED', 'FAILED'],
        AUTHORIZED: ['CAPTURED', 'FAILED'],
        CAPTURED: ['REFUNDED'],
        FAILED: [],
        REFUNDED: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
}