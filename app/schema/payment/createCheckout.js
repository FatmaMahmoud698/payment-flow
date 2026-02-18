exports.createCheckoutSchema = {
    type: 'object',
    required: ['body'],
    properties: {
      body: {
        type: 'object',
        required: ['userId', 'amount', 'currency'],
        properties: {
          userId: {
            type: 'string',
            errorMessage: 'Invalid userId',
          },
          amount: {
            type: 'number',
            errorMessage: 'Invalid amount',
            minimum: 0,
          },
          currency: {
            type: 'string',
            errorMessage: 'Invalid currency',
          },
        },
        additionalProperties: false,
        errorMessage: {
        required: {
          userId: 'userId is required',
          amount: 'amount is required',
          currency: 'currency is required',
        },
        additionalProperties: 'Unexpected additional properties',
        },
      },
      query: {},
      params: {},
    },
  };
  