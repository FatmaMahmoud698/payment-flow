const { paymentStatus } = require('../config');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
      },
      currency: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM(...Object.values(paymentStatus)),
        defaultValue: paymentStatus.created,
      },
      gateway: {
        type: Sequelize.STRING,
        defaultValue: 'mock',
      },
      gatewayPaymentId: {
        type: Sequelize.STRING,
      },
      idempotencyKey: {
        type: Sequelize.STRING,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payments_status";');
  },
};
