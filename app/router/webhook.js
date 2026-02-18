const express = require("express");
const router = express.Router();
const { validate } = require("../middleware/validator");
const { xSignature } = require("../services/strategies");
const { createEventSchema } = require("../schema/webhook/createEvent");
const { processWebhookEvent } = require("../controllers/webhook");

router.post('/mock', xSignature, validate(createEventSchema), processWebhookEvent);

exports.WebhookRouter = router;
