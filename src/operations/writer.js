const assert = require("assert");
const {Transform} = require("stream");
const pino = require("pino");

class Writer extends Transform {
  constructor({provider, logger}){
    super({
      "objectMode": true,
      "highWatermark": 10
    });

    assert(provider, "provider is required.");
    assert(logger, "logger is required.");

    this._logger = logger;
    this._provider = provider;
  }

  _transform(chunk, encoding, cb) {
    return this._provider.sink(chunk)
      .then(() => this.push(chunk))
      .catch(err => cb(err));
  }
}

module.exports = provider => {
  assert(provider, "The provider is required to Sink.");

  const logger = pino({"name": "Writer"});

  return new Writer({provider, logger});
};

module.exports.Writer = Writer;
