const { outboxStatus } = require('../config');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('outbox', {
      id: { 
        type: Sequelize.UUID, 
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true, 
        allowNull: false 
      },
      paymentId: {
        type: Sequelize.UUID,
        references: { 
          model: 'payments', 
          key: 'id' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      type: { 
        type: Sequelize.STRING 
      },
      payload: { 
        type: Sequelize.JSONB 
      },
      status: {
        type: Sequelize.ENUM(...Object.values(outboxStatus)),
        defaultValue: outboxStatus.pending,
      },
      nextAttemptAt: { 
        type: Sequelize.DATE 
      },
      attempts: { 
        type: Sequelize.INTEGER, 
        defaultValue: 0 
      },
      createdAt: { 
        allowNull: false, 
        type: Sequelize.DATE 
      },
      updatedAt: { 
        allowNull: false, 
        type: Sequelize.DATE 
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('outbox');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_outbox_status";');
  },
};