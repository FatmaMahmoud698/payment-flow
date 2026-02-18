const axios = require('axios');

exports.createMockCheckout = async ({amount, currency, metaData={}}) => {
  try {
      const { data } = await axios.post(`${process.env.MOCK_GATEWAY_URL}/mock/checkout`, {amount, currency, metaData}
      , { headers: { 'Content-Type': 'application/json' }});
      return { data };
  } catch (error) {
    return { err: "Error creating mock checkout", status: error.response?.status || 500 };
  }
}
