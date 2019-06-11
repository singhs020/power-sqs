const assert = require("assert");
const {Writable} = require("stream");
const pino = require("pino");

class Remover extends Writable {
  constructor({url, logger, sqs}){
    super({
      "objectMode": true,
      "highWatermark": 10
    });

    assert(url, "url is required");
    assert(sqs, "sqs is required");
    assert(logger, "logger is required");

    this._logger = logger;
    this._sourceUrl = url;
    this._sqs = sqs;
  }

  _deleteMessages(data) {
    const messages = data.Messages.map(item => ({"Id": item.MessageId, "ReceiptHandle": item.ReceiptHandle}));

    const params = {
      "QueueUrl": this._sourceUrl,
      "Entries": messages
    };

    return new Promise((resolve, reject) => {
      this._sqs.deleteMessageBatch(params, (err, data) => {
        if(err) {
          return reject(err);
        }

        resolve(data);
      });
    });
  }

  _write(chunk, encoding, cb) {
    return this._deleteMessages(chunk)
      .then(() => cb())
      .catch(err => cb(err));
  }
}

module.exports = (config, sqs) => {
  // validate config
  const {url} = config;
  const logger = pino({"name": "SQS Message Remover"});

  return new Remover({url, sqs, logger});
};

module.exports.Remover = Remover;
