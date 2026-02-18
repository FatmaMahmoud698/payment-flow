const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const trimRequest = require("trim-request");
const { v4: uuidv4 } = require('uuid');
const pino = require('pino-http');
const debug = require("debug")("app:express");

const { ServerError } = require("../utils/core");
const { PaymentRouter } = require("./router/payment");
const { WebhookRouter } = require("./router/webhook");

const app = express();

app.use(pino({
  genReqId: (req) => req.headers['x-request-id'] || uuidv4(),
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
}));

app.use(helmet({
  hidePoweredBy: true, 
  referrerPolicy: { policy: "no-referrer" },
}));
app.use(cors());

app.use(bodyParser.json({ 
  limit: "50mb", 
  strict: false,
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(trimRequest.all);

app.get("/", (req, res) => {
  res.json({ message: "server is Up and Running!", requestId: req.id });
});

app.use("/payments", PaymentRouter);
app.use("/webhooks", WebhookRouter);

app.use((req, res, next) => {
  next(new ServerError("API_NOT_FOUND", 404));
});

app.use((err, req, res, next) => {
  req.log.error(err); 

  const status = err.status || 500;
  const message = status === 500 ? "Internal Server Error" : err.message;

  return res.status(status).json({ 
    message, 
    status,
    requestId: req.id
  });
});

module.exports = { app };