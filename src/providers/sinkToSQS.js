const assert = require("assert");
const AWS = require("aws-sdk");

class SQSProvider {
  constructor({config, logger}) {

    assert(config, "config is required.");
    assert(logger, "logger is required.");

    this._SQS = new AWS.SQS({
      "apiVersion": "2012-11-05"
    });
    this._logger = logger;
    this._params = {
      "QueueUrl": config.url
    };
  }

  sink(data) {
    this._logger.log(data);
    const messages = data.Messages.map(item => ({"Id": item.MessageId, "MessageBody": item.Body}));
    const params = Object.assign({}, this._params, {"Entries": messages});

    return new Promise((resolve, reject) => {

      this._SQS.sendMessageBatch(params, (err, data) => {
        if(err) {
          this._logger.err(err);
          return reject(err);
        }

        return resolve(data);
      })
    }); 
  }
}

module.exports = SQSProvider;
