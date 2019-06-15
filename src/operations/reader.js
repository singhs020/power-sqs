const assert = require("assert");
const {Readable} = require("stream");
const pino = require("pino");

class Reader extends Readable {
  constructor({url, logger, sqs, isBulkOps = false}) {
    super({
      "objectMode": true,
      "highWatermark": 10
    });

    assert(url, "QueueUrl is required.");
    assert(logger, "logger is required.");
    assert(sqs, "sqs is required.");

    this._logger = logger;
    this._sqs = sqs;
    this._isBulkOps = isBulkOps;
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
        if(this._isBulkOps) {
          return this.push(data);
        }

        data.Messages.forEach(msg => {
          this.push(msg);
        });

        return;
      }

      this._logger.info("No messages found. Trying to read again...");
      this._read();
    });
  }
}

function validateConfig(config = {}) {
  assert(config.url, "The SQS Url is required by the Reader");
}

module.exports.getReader = (config, sqs) => {
  validateConfig(config);

  const {url} = config;
  const logger = pino({"name": "SQS Reader"});

  return new Reader({url, sqs, logger});
};

module.exports.getBulkReader = (config, sqs) => {
  validateConfig(config);

  const {url} = config;
  const logger = pino({"name": "SQS Bulk Reader"});

  return new Reader({url, sqs, logger, "isBulkOps": true});
};

module.exports.Reader = Reader;
