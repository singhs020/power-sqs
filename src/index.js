const SQS = require("aws-sdk/clients/sqs");

const {getReader, getBulkReader, getPowerReader} = require("./operations");
const {initSinkToSQS} = require("./sink");

const sqs = new SQS({
  "apiVersion": "2012-11-05"
});

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
  initSinkToSQS
}