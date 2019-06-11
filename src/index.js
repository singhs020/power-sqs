const SQS = require("aws-sdk/clients/sqs");

const {getReader, getRemover} = require("./operations");
const {initSinkToSQS} = require("./sink");

const sqs = new SQS({
  "apiVersion": "2012-11-05"
});

function getSQSReader(config) {
  return getReader(config, sqs);
}

function getSQSMessageRemover(config) {
  return getRemover(config, sqs);
}

module.exports = {
  getSQSReader,
  getSQSMessageRemover,
  initSinkToSQS
}