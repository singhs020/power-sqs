const SQS = require("aws-sdk/clients/sqs");

const {getBulkReader, getWriter, getBulkRemover} = require("../operations");
const {getSinkToSQS} = require("../providers");

const sqs = new SQS({
  "apiVersion": "2012-11-05"
});

module.exports = config => {

  // validate config -- add schema

  const provider = getSinkToSQS(config.destination);
  const reader = getBulkReader(config.source, sqs);
  const writer = getWriter(provider);
  const remover = getBulkRemover(config.source, sqs);

  reader.pipe(writer).pipe(remover);
}
