const {assert} = require("chai");
const {spy} = require("sinon");
const {Readable, Writable} = require("stream");

const {getBulkRemover} = require("../../src/operations");
const {Remover} = require("../../src/operations/remover");

const url = "foo:bar";
const logger = {
  "error": spy(),
  "info": spy()
};
const messages = {
  "Messages": [{
    "MessageId": "bar",
    "ReceiptHandle": "RH"
  }]
};
const params = {
  "QueueUrl": url,
  "Entries": messages.Messages.map(item => {
    return {
      "Id": item.MessageId,
      "ReceiptHandle": item.ReceiptHandle
    };
  })
};

let sqs;

class Reader extends Readable {
  constructor() {
    super({"objectMode": true});
  }

  _read() {
    this.push(messages);
  }
}

function getSQSMock(data = messages, isError = false) {
  return {
    "deleteMessageBatch": spy((params, cb) => {
      if(!isError) {
        return cb(null, data);
      }

      cb("Error", null);
    })
  };
}

describe("The Remover Operation", () => {

  describe("getBulkRemover methond", () => {
    it("should throw an error when url is not passed in config", () => {
      assert.throw(() => getBulkRemover({}), "The SQS Url is required by the Remover");
    });

    it("should return an instance of Remover Class", () => {
      const remover = getBulkRemover({url}, getSQSMock());

      assert.instanceOf(remover, Remover);
    });
  });

  describe("The Remover class", () => {
    describe("The constructor", () => {
      it("should throw an error when \"url\" is not passed", () => {
        assert.throw(() => new Remover({}), "QueueUrl is required.");
      });

      it("should throw an error when \"logger\" is not passed", () => {
        assert.throw(() => new Remover({url}), "logger is required.");
      });

      it("should throw an error when \"sqs\" is not passed", () => {
        assert.throw(() => new Remover({url, logger}), "sqs is required.");
      });

      it("should return a Writable stream", () => {
        const remover = new Remover({url, logger, "sqs": getSQSMock()});

        assert.instanceOf(remover, Writable);
      });
    });

    describe("The _write method of the Remover", () => {
      it("should call the deleteMessageBatch of sqs with appropriate args", done => {
        sqs = getSQSMock();
        const reader = new Reader();
        const remover = new Remover({url, logger, sqs});

        reader.pipe(remover);

        process.nextTick(() => reader.push(null));

        remover.on("finish", () => {
          assert.deepEqual(sqs.deleteMessageBatch.firstCall.args[0], params);
          done();
        });
      });

      it("should handle error", done => {
        sqs = getSQSMock(messages, true);
        const reader = new Reader();
        const remover = new Remover({url, logger, sqs});

        reader.pipe(remover);

        remover.on("error", err => {
          assert.strictEqual(err, "Error");
          done();
        });
      });
    });
  });
});