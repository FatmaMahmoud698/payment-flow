const {
  processWebhookEvent,
} = require("../services/webhook");

const { controller } = require("../middleware/controller")
module.exports = {
  processWebhookEvent: controller(processWebhookEvent),
};
