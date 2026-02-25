const { Op } = require('sequelize');
const db = require('../models');
const retryAfter = 30 * 60 * 1000; // 30 minutes
async function processOutbox() {
  const MAX_ATTEMPTS = 3;
  const BATCH_SIZE = 10;

  try {
    const pendingTasks = await db.Outbox.findAll({
      where: {
        status: { [Op.in]: ['PENDING', 'FAILED'] },
        nextAttemptAt: { [Op.lte]: new Date() },
        attempts: { [Op.lt]: MAX_ATTEMPTS }
      },
      order: [['nextAttemptAt', 'ASC']],
      limit: BATCH_SIZE
    });

    if (pendingTasks.length === 0) return;

    for (const task of pendingTasks) {
      try {
        ///
        await task.update({status: 'SENT', attempts: task.attempts + 1});
      } catch (err) {
        ///
        const newRetryTime = new Date(Date.now() + retryAfter);
        await task.update({
          attempts: task.attempts + 1,
          status: 'FAILED',
          nextAttemptAt: newRetryTime
        });
      }
    }
  } catch (error) {
    console.error('Error processing outbox:', error);
  }
}

setInterval(processOutbox, retryAfter);