const express = require("express");
const router = express.Router();
const { validate } = require("../middleware/validator");
const { idempotencyKey } = require("../services/strategies");
const { createCheckout, getPaymentDetails } = require("../controllers/payment");

const { createCheckoutSchema } = require("../schema/payment/createCheckout.js");

router.post('/', idempotencyKey, validate(createCheckoutSchema), createCheckout);

router.get('/:id', getPaymentDetails);


exports.PaymentRouter = router;
