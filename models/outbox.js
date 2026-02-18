const { outboxStatus } = require('../config');

module.exports = (sequelize, DataTypes) => {
    const Outbox = sequelize.define('Outbox', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
        },
        payload: {
            type: DataTypes.JSONB,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(outboxStatus)),
            defaultValue: outboxStatus.pending,
        },
        nextAttemptAt: {
            type: DataTypes.DATE,
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
        tableName: "outbox",
    });
        Outbox.associate = (models) => {
            Outbox.belongsTo(models.Payment, { as: 'payment', foreignKey: 'paymentId' });
        }
    return Outbox;
};
