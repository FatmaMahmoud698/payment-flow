const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

const payments = new Map();


// create checkout api
app.post('/mock/checkout', (req, res) => {
  const { amount, currency, metaData={} } = req.body;

  if (!amount || amount <= 0 ) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (!currency || typeof currency !== 'string' || currency.trim() === '') {
    return res.status(400).json({ error: 'Currency is required' });
  }

  const gatewayPaymentId = `payment_${uuidv4()}`;
  const checkoutUrl = `http://localhost:${PORT}/mock/checkout/${gatewayPaymentId}`;

  payments.set(gatewayPaymentId, {
    gatewayPaymentId,
    amount,
    currency,
    status: 'CREATED',
    createdAt: new Date(),
    updatedAt: new Date(),
    metaData,
  });

  res.json({
    gatewayPaymentId,
    checkoutUrl,
  });
});

app.get('/mock/checkout/:gatewayPaymentId', (req, res) => {
  const { gatewayPaymentId } = req.params;
  const payment = payments.get(gatewayPaymentId);
  
  if (!payment) {
    return res.status(404).send('Payment not found');
  }
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mock Payment Gateway</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; font-size: 16px; }
        .success { background: #4CAF50; color: white; border: none; border-radius: 4px; }
        .fail { background: #f44336; color: white; border: none; border-radius: 4px; }
        .amount { font-size: 24px; font-weight: bold; color: #333; }
      </style>
    </head>
    <body>
      <h1>Mock Payment Gateway</h1>
      <div class="card">
        <p>Payment ID: ${gatewayPaymentId}</p>
        <p class="amount">${payment.currency} ${payment.amount}</p>
        <p>Status: ${payment.status}</p>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
    console.log(`Mock payment gateway server is running on port ${PORT}`);
});