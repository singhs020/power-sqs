const assert = require("assert");
const pino = require("pino");
const AWS = require("aws-sdk");

class SQSProvider {
  constructor({logger, url, sqs}) {

    assert(logger, "logger is required.");
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

module.exports = config => {

  // validate config

  const {url} = config;
  const logger = pino({"name": "SQS Provider"});
  const sqs = new AWS.SQS({
    "apiVersion": "2012-11-05"
  });

  return new SQSProvider({url, sqs, logger});
};