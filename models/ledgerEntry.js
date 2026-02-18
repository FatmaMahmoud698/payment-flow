module.exports = (sequelize, DataTypes) => {
    const LedgerEntry = sequelize.define('LedgerEntry', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
        },
        direction: {
            type: DataTypes.ENUM('CREDIT', 'DEBIT'),
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
        },
        currency: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'PAYMENT_CAPTURE',
        },
    }, {
        timestamps: true,
        tableName: "ledger_entries",
        indexes: [
            {
                unique: true,
                fields: ['paymentId', 'type'],
            },
        ],
    });
        LedgerEntry.associate = (models) => {
        LedgerEntry.belongsTo(models.Payment, { as: 'payment', foreignKey: 'paymentId' });
    }

    return LedgerEntry;
};
