const assert = require("assert");
const {Readable} = require("stream");
const pino = require("pino");

class Reader extends Readable {
  constructor({url, logger, sqs}) {
    super({
      "objectMode": true,
      "highWatermark": 10
    });

    assert(url, "QueueUrl is required.");
    assert(logger, "logger is required.");
    assert(sqs, "sqs is required.");

    this._logger = logger;
    this._sqs = sqs;
    this._params = {
      "QueueUrl": url,
      "MaxNumberOfMessages": 10,
      "WaitTimeSeconds": 10
    };
  }
  _read() {
    this._sqs.receiveMessage(this._params, (err, data) => {
      if(err) {
        this._logger.error("There was an error while reading data from SQS", err);
        return this.push(null);
      }

      if(Array.isArray(data.Messages)) {
        return this.push(data);
      }

      this._logger.info("No messages found. Trying to read again...");
      this._read();
    });
  }
}

module.exports = (config, sqs) => {
  // validate config

  const {url} = config;
  const logger = pino({"name": "SQS Reader"});

  return new Reader({url, sqs, logger});
};
