const {assert} = require("chai");
const {spy} = require("sinon");

const {getSinkToSQS} = require("../../src/providers");
const {SQSProvider} = require("../../src/providers/sinkToSQS");

const url = "foo:bar";
const logger = {
  "info": spy(),
  "error": spy()
};
const messages = {
  "Messages": [{
    "MessageId": "bar",
    "ReceiptHandle": "RH",
    "Body": "Test"
  }]
};
const params = {
  "QueueUrl": url,
  "Entries": messages.Messages.map(item => {
    return {
      "Id": item.MessageId,
      "MessageBody": item.Body
    };
  })
};

let sqs = getSQSMock();
let provider;

function getSQSMock(isError = false) {
  return {
    "sendMessageBatch": spy((params, cb) => {
      if(!isError) {
        return cb(null, {});
      }

      cb("Error", {});
    })
  };
}

describe("The Sink To SQS Provider", () => {
  describe("The getSinkToSQS method", () => {
    it("should throw an error when url is provided", () => {
      assert.throw(() => getSinkToSQS(), "The SQS Url is required by the SQS Provider.")
    });

    it("should return an instance of the SQSProvider", () => {
      const provider = getSinkToSQS({url});

      assert.instanceOf(provider, SQSProvider);
    });
  });

  describe("The SQSProvider Class", () => {
    describe("The constructor", () => {
      it("should throw an error when logger is not provided", () => {
        assert.throw(() => new SQSProvider({}), "logger is required.")
      });

      it("should throw an error when url is not provided", () => {
        assert.throw(() => new SQSProvider({logger}), "QueueUrl is required.")
      });

      it("should throw an error when sqs is not provided", () => {
        assert.throw(() => new SQSProvider({logger, url}), "sqs is required.")
      });

      it("should return an instance", () => {
        const provider = new SQSProvider({logger, sqs, url});
        assert.instanceOf(provider, SQSProvider);
      });
    });

    describe("The sink method", () => {

      it("should call the sendMessageBatch with appropriate args", () => {
        sqs = getSQSMock();
        provider = new SQSProvider({url, logger, sqs});

        return provider.sink(messages)
          .then(() => {
            assert.deepEqual(sqs.sendMessageBatch.firstCall.args[0], params);
          });
      });

      it("should handle the errors", () => {
        sqs = getSQSMock(true);
        provider = new SQSProvider({url, logger, sqs});

        return provider.sink(messages)
          .catch(err => {
            assert.equal(err, "Error");
          });
      });
    });
  });
});
