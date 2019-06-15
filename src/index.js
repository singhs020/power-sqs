const SQS = require("aws-sdk/clients/sqs");

const {getReader, getBulkReader} = require("./operations");
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

module.exports = {
  getSQSReader,
  getSQSBulkReader,
  initSinkToSQS
}