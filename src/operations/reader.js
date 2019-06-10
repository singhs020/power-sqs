const assert = require("assert");
const AWS = require("aws-sdk");
const {Readable} = require("stream");

const SQS = new AWS.SQS({
  "apiVersion": "2012-11-05"
});

class Reader extends Readable {
  constructor({url, logger}) {
    super({
      "objectMode": true,
      "highWatermark": 10
    });

    assert(url, "QueueUrl is required.");
    assert(logger, "logger is required.");

    this._logger = logger;
    this._params = {
      "QueueUrl": url,
      "MaxNumberOfMessages": 10,
      "WaitTimeSeconds": 10
    };
  }
  _read() {
    SQS.receiveMessage(this._params, (err, data) => {
      if(err) {
        this._logger.error("There was an error while reading data from SQS", err);
        return this.push(null);
      }

      if(Array.isArray(data.Messages)) {
        return this.push(data);
      }

      this._logger.log("No messages found. Trying to read again...");
      this._read();
    });
  }
}

module.exports = Reader;
