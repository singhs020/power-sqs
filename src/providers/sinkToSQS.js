const assert = require("assert");
const pino = require("pino");
const AWS = require("aws-sdk");

class SQSProvider {
  constructor({logger, url, sqs}) {

    assert(logger, "logger is required.");
    assert(url, "QueueUrl is required.");
    assert(sqs, "sqs is required.");

    this._sqs = sqs;
    this._logger = logger;
    this._params = {
      "QueueUrl": url
    };
  }

  sink(data) {
    const messages = data.Messages.map(item => ({"Id": item.MessageId, "MessageBody": item.Body}));
    const params = Object.assign({}, this._params, {"Entries": messages});

    return new Promise((resolve, reject) => {

      this._sqs.sendMessageBatch(params, (err, data) => {
        if(err) {
          this._logger.error(err);
          return reject(err);
        }

        return resolve(data);
      })
    }); 
  }
}

function validateConfig(config = {}) {
  assert(config.url, "The SQS Url is required by the SQS Provider.");
}

module.exports = config => {

  validateConfig(config)

  const {url} = config;
  const logger = pino({"name": "SQS Provider"});
  const sqs = new AWS.SQS({
    "apiVersion": "2012-11-05"
  });

  return new SQSProvider({url, sqs, logger});
};

module.exports.SQSProvider = SQSProvider;
