const assert = require("assert");
const {Readable} = require("stream");
const pino = require("pino");

class Reader extends Readable {
  constructor({url, logger, sqs, isBulkOps = false, stopOnEmpty = false}) {
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
    this._counter = 0;
    this._stopOnEmpty = stopOnEmpty;
  }
  _read() {
    this._sqs.receiveMessage(this._params, (err, data) => {
      if(err) {
        this._logger.error("There was an error while reading data from SQS", err);
        return this.push(null);
      }

      if(Array.isArray(data.Messages)) {
        this._counter = 0;

        if(this._isBulkOps === true) {
          return this.push(data);
        }

        data.Messages.forEach(msg => {
          this.push(msg);
        });

        return;
      }

      if(this._stopOnEmpty === true && this._counter > 4) {
        this._logger.info("No messages found for 5 retries. closing the connection");
        this.push(null);
        process.exit(0);
      }

      this._logger.info("No messages found. Trying to read again...");
      this._counter++;
      this._read();
    });
  }
}

function validateConfig(config = {}) {
  assert(config.url, "The SQS Url is required by the Reader");
}

module.exports.getReader = (config, sqs) => {
  validateConfig(config);

  const {url, stopOnEmpty, isBulkOps} = config;
  const logger = pino({"name": "SQS Reader"});

  return new Reader({url, sqs, logger, stopOnEmpty, isBulkOps});
};

module.exports.Reader = Reader;
