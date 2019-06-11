const SQS = require("aws-sdk/clients/sqs");

const {getReader, getWriter, getRemover} = require("../operations");
const {getSinkToSQS} = require("../providers");

const sqs = new SQS({
  "apiVersion": "2012-11-05"
});

module.exports = config => {

  // validate config

  const provider = getSinkToSQS(config.destination);
  const reader = getReader(config.source, sqs);
  const writer = getWriter(provider);
  const remover = getRemover(config.source, sqs);

  reader.pipe(writer).pipe(remover);
}
