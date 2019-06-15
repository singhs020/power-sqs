const {assert} = require("chai");
const {spy} = require("sinon");
const {Readable} = require("stream");

const {getReader} = require("../../src/operations");
const {Reader} = require("../../src/operations/reader");

const url = "foo:bar";
const logger = {
  "error": spy(),
  "info": spy()
};
const sqs = {
  "receiveMessages": spy()
};

describe("The Reader Operation", () => {
  describe("The getReader method", () => {
    it("should throw an error when url is not passed in config", () => {
      assert.throw(() => getReader({}), "The SQS Url is required by the Reader");
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
        const reader = new Reader({url, logger, sqs});

        assert.instanceOf(reader, Readable);
      });
    });
  });
});
