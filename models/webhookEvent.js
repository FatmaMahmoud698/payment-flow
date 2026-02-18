module.exports = (sequelize, DataTypes) => {
    const WebhookEvent = sequelize.define('WebhookEvent', {
        gateway: {
            type: DataTypes.STRING,
        },
        eventId: {
            type: DataTypes.STRING,
            unique: true,
        },
        type: {
            type: DataTypes.STRING,
        },
        payload: {
            type: DataTypes.JSONB,
        },
        receivedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        timestamps: false,
        tableName: "webhook_events",
        indexes: [
            {
                unique: true,
                fields: ['eventId', 'gateway'],
            },
        ],
    });

    return WebhookEvent;
};
