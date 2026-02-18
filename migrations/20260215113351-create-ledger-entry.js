module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ledger_entries', {
      id: { 
        type: Sequelize.UUID, 
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true, 
        allowNull: false 
      },
      paymentId: {
        type: Sequelize.UUID,
        references: { model: 'payments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      userId: { 
        type: Sequelize.STRING 
      },
      direction: { 
        type: Sequelize.ENUM('CREDIT', 'DEBIT') 
      },
      amount: { 
        type: Sequelize.DECIMAL(12, 2) 
      },
      currency: { 
        type: Sequelize.STRING 
      },
      type: { 
        type: Sequelize.STRING, 
        defaultValue: 'PAYMENT_CAPTURE' 
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
    await queryInterface.addIndex('ledger_entries', ['paymentId', 'type'], {
      unique: true,
      name: 'ledger_payment_type_unique'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ledger_entries');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ledger_entries_direction";');
  },
};