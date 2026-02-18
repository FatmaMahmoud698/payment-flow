const {
  createCheckout,
  getPaymentDetails,
} = require("../services/payment");

const { controller } = require("../middleware/controller")
module.exports = {
  createCheckout: controller(createCheckout),
  getPaymentDetails: controller(getPaymentDetails),
};
