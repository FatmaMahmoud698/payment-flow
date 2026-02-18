const { paymentStatus } = require('../config');
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
        },
        currency: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(paymentStatus)),
            defaultValue: paymentStatus.created,
        },
        gateway: {
            type: DataTypes.STRING,
            defaultValue: 'mock',
        },
        gatewayPaymentId: {
            type: DataTypes.STRING,
        },
        idempotencyKey: {
            type: DataTypes.STRING,
            unique: true,
        },
    }, {
        timestamps: true,
        tableName: "payments",
    });
      Payment.associate = (models) => {
        Payment.hasMany(models.LedgerEntry, { as: 'ledgerEntries', foreignKey: 'paymentId' });
    }
    return Payment;
};

