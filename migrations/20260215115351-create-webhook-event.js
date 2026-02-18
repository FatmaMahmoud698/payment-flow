module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('webhook_events', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      gateway: { 
        type: Sequelize.STRING 
      },
      eventId: { 
        type: Sequelize.STRING, 
        unique: true 
      },
      type: { 
        type: Sequelize.STRING 
      },
      payload: { 
        type: Sequelize.JSONB 
      },
      receivedAt: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('NOW()') 
      },
    });

    await queryInterface.addIndex('webhook_events', ['eventId', 'gateway'], {
      unique: true,
      name: 'webhook_event_gateway_unique'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('webhook_events');
  },
};