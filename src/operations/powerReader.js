const h = require("highland");

const {getReader} = require("./reader");

exports.getPowerReader = (config, sqs) => {
  const reader = getReader(config, sqs);

  return h(reader);
}
