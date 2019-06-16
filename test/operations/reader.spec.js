const {assert} = require("chai");
const {spy} = require("sinon");
const {Readable} = require("stream");

const {getBulkReader, getReader} = require("../../src/operations");
const {Reader} = require("../../src/operations/reader");

const url = "foo:bar";
const logger = {
  "error": spy(),
  "info": spy()
};
const messages = {
  "Messages": [{
    "foo": "bar"
  }]
};
const params = {
  "QueueUrl": url,
  "MaxNumberOfMessages": 10,
  "WaitTimeSeconds": 10
};

let sqs;
let count = 0;

function getSQSMock(data = messages) {
  count = 0;
  return {
    "receiveMessage": spy((params, cb) => {
      if(count === 1) {
        count = 0;
        return cb(null, messages);
      }

      count += 1;
      cb(null, data);
    })
  };
} 

describe("The Reader Operation", () => {
  describe("The getReader method", () => {
    it("should throw an error when url is not passed in config", () => {
      assert.throw(() => getReader({}), "The SQS Url is required by the Reader");
    });

    it("should return an instance of Reader Class", () => {
      const reader = getReader({url}, getSQSMock());

      assert.instanceOf(reader, Reader);
    });
  });

  describe("The getBulkReader method", () => {
    it("should throw an error when url is not passed in config", () => {
      assert.throw(() => getBulkReader({}), "The SQS Url is required by the Reader");
    });

    it("should return an instance of Reader Class", () => {
      const reader = getBulkReader({url}, getSQSMock());

      assert.instanceOf(reader, Reader);
    });
  });

  describe("The Reader Class", () => {
    describe("The constructor", () => {
      it("should throw an error when \"url\" is not passed", () => {
        assert.throw(() => new Reader({}), "QueueUrl is required.");
      });

      it("should throw an error when \"logger\" is not passed", () => {
        assert.throw(() => new Reader({url}), "logger is required.");
      });

      it("should throw an error when \"sqs\" is not passed", () => {
        assert.throw(() => new Reader({url, logger}), "sqs is required.");
      });

      it("should return a readable stream", () => {
        const reader = new Reader({url, logger, "sqs": getSQSMock()});

        assert.instanceOf(reader, Readable);
      });
    });

    describe("The _read method of the Reader", () => {
      it("should call the receiveMessage method of sqs with appropriate args", done => {
        sqs = getSQSMock();
        const reader = new Reader({url, logger, sqs});

        reader.on("data", () => {
          assert.deepEqual(sqs.receiveMessage.firstCall.args[0], params);
          reader.destroy();
        });

        reader.on("close", done);
      });

      it("should read again when no messages are found", done => {
        sqs = getSQSMock({});
        const reader = new Reader({url, logger, sqs});

        reader.on("data", () => {
          reader.destroy();
        });

        reader.on("close", () => {
          assert.isTrue(sqs.receiveMessage.callCount > 2);
          done();
        });
      });

      it("should log and end the stream when there is an error in receiving the messages", done => {
        sqs = {
          "receiveMessage": spy((params, cb) => cb("Error", null))
        };
        const reader = new Reader({url, logger, sqs});

        reader.on("data", () => {});

        reader.on("end", () => {
          assert.isTrue(logger.error.calledWith("There was an error while reading data from SQS"));
          done();
        });
      });
    });

    describe("When isBulkOps is set to true", () => {
      before(() => {
        sqs = getSQSMock();
      });

      it("should push the messages in bulk", done => {
        const reader = new Reader({url, logger, sqs, "isBulkOps": true});

        reader.on("data", chunk => {
          assert.deepEqual(chunk, messages);
          reader.destroy();
        });

        reader.on("close", done);
      });
    });

    describe("When isBulkOps is set to false", () => {
      before(() => {
        sqs = getSQSMock();
      });

      it("should push the messages one by one", done => {
        const reader = new Reader({url, logger, sqs});

        reader.on("data", chunk => {
          assert.deepEqual(chunk, messages.Messages[0]);
          reader.destroy();
        });

        reader.on("close", done);
      });
    });
  });
});
