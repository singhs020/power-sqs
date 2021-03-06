const SQS = require("aws-sdk/clients/sqs");

const {
  getReader,
  getBulkReader,
  getPowerReader,
  getDeleteMessageFunc,
  getSendMessageFunc,
  getReceiveMessagesFunc,
  getSendFifoMessageFunc
} = require("./operations");
const {initSinkToSQS} = require("./sink");

const sqs = new SQS({
  "apiVersion": "2012-11-05"
});

const deleteMessages = getDeleteMessageFunc(sqs);
const sendMessages = getSendMessageFunc(sqs);
const sendFifoMessages = getSendFifoMessageFunc(sqs);
const receiveMessages = getReceiveMessagesFunc(sqs);

function getSQSReader(config) {
  return getReader(config, sqs);
}

function getSQSBulkReader(config) {
  return getBulkReader(config, sqs);
}

function getSQSPowerReader(config) {
  return getPowerReader(config, sqs);
}

module.exports = {
  getSQSReader,
  getSQSBulkReader,
  getSQSPowerReader,
  deleteMessages,
  sendMessages,
  sendFifoMessages,
  receiveMessages,
  initSinkToSQS
}