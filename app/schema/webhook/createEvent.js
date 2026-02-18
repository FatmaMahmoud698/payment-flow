exports.createEventSchema = {
    type: 'object',
    required: ['body'],
    properties: {
      body: {
        type: 'object',
        required: ['eventId', 'eventType', 'payload'],
        properties: {
          eventId: {
            type: 'string',
            errorMessage: 'Invalid eventId',
          },
          eventType: {
            type: 'string',
            errorMessage: 'Invalid eventType',
          },
          payload: {
            type: 'object',
            required: ['gatewayPaymentId'],
            properties: {
              gatewayPaymentId: {
                type: 'string',
                errorMessage: 'Invalid gatewayPaymentId in payload',
              },
            },
            additionalProperties: true,
            errorMessage: 'Invalid payload',
          },
        },
        additionalProperties: false,
        errorMessage: {
        required: {
          eventId: 'eventId is required',
          eventType: 'eventType is required',
          payload: 'payload is required',
        },
        additionalProperties: 'Unexpected additional properties',
        },
      },
      query: {},
      params: {},
    },
  };
  