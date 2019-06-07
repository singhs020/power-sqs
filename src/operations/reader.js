const AWS = require("aws-sdk");
const {Readable} = require("stream");

const SQS = new AWS.SQS({
  "apiVersion": "2012-11-05"
});

class Reader extends Readable {
  constructor({url, logger}){
    super({"objectMode": true});

    this._logger = logger;
    this._params = {
      "QueueUrl": url
    };
  }
  _read(){
    SQS.receiveMessage(this._params, (err, data) => {
      if(err) {
        this._logger.error("There was an error while reading data from SQS", err);
      }

      this.push(JSON.stringify(data));
    });
  }
}

module.exports = Reader;