const assert = require("assert");
const {Writable} = require("stream");

class Writer extends Writable {
  constructor({provider, sourceUrl, logger, sqs}){
    super({
      "objectMode": true,
      "highWatermark": 10
    });

    assert(provider, "provider is required");
    assert(sourceUrl, "sourceUrl is required");
    assert(sqs, "sqs is required");
    assert(logger, "logger is required");

    this._logger = logger;
    this._provider = provider;
    this._sourceUrl = sourceUrl;
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
    return this._provider.sink(chunk)
      .then(() => this._deleteMessages(chunk))
      .then(() => cb())
      .catch(err => cb(err));
  }
}

module.exports = Writer;