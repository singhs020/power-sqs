const {assert} = require("chai");
const {stub, spy} = require("sinon");
const {Transform, Readable} = require("stream");

const {getWriter} = require("../../src/operations");
const {Writer} = require("../../src/operations/writer");

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

let provider = getProviderMock();

function getProviderMock(isError = false) {
  return {
    "sink":!isError ? stub().resolves("Resolved") : stub().rejects("Error")
  };
}

class Reader extends Readable {
  constructor() {
    super({"objectMode": true});
  }

  _read() {
    this.push(messages);
  }
}

describe("The Writer operation", () => {
  describe("The getWriter method", () => {
    it("should throw an error when provider is not available", () => {
      assert.throw(() => getWriter(), "The provider is required to Sink.")
    });

    it("should return an instance of Writer", () => {
      const writer = getWriter(getProviderMock());

      assert.instanceOf(writer, Writer);
    });
  });

  describe("The Writer class", () => {
    describe("The constructor", () => {
      it("should throw an error when \"provider\" is not passed", () => {
        assert.throw(() => new Writer({}), "provider is required.");
      });

      it("should throw an error when \"logger\" is not passed", () => {
        assert.throw(() => new Writer({provider}), "logger is required.");
      });

      it("should return a Transform stream", () => {
        const remover = new Writer({provider, logger});

        assert.instanceOf(remover, Transform);
      });
    });

    describe("The _transform method", () => {
      it("should call the sink function of the provider with appropriate args", done => {
        provider = getProviderMock();
        const reader = new Reader();
        const writer = new Writer({provider, logger});

        reader.pipe(writer);

        writer.on("data", () => {
          reader.destroy();
          writer.destroy();
        });

        writer.on("close", () => {
          assert.deepEqual(provider.sink.firstCall.args[0], messages);
          done();
        });
      });

      it("should handle errors", done => {
        provider = getProviderMock(true);
        const reader = new Reader();
        const writer = new Writer({provider, logger});

        reader.pipe(writer);

        writer.on("data", () => {
          reader.destroy();
          writer.destroy();
        });

        writer.on("error", err => {
          assert.instanceOf(err, Error);
          done();
        });
      });
    });
  });
});
