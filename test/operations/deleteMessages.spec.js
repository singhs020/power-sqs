const {expect} = require("chai");
const {stub} = require("sinon");

const getDeleteMessageFunc = require("../../src/operations/deleteMessages");

const queueUrl = "thisisaqueueUrl";
const validMessages = [{
  "Id": "foo",
  "ReceiptHandle": "bar"
}];
const invalidMessages = [
  ...validMessages,
  {
    "Id": "invalidFoo"
  }
];
const sqs = {
  "deleteMessageBatch": stub().returns({
    "promise": stub().resolves()
  })
};
const deleteMessages = getDeleteMessageFunc(sqs);

describe("the deleteMessages Method", () => {
  describe("when deleteMessages is called without the queueUrl", () => {
    it("should throw an error", () => {
      return deleteMessages()
        .catch(err => expect(err.message).to.equal("Queue Url maust be a valid string."));
    });
  });

  describe("when deleteMessages is called without the messages", () => {
    it("should throw an error", () => {
      return deleteMessages(queueUrl)
        .catch(err => expect(err.message).to.equal("Messages must be an array of messages from sqs."));
    });
  });

  describe("when deleteMessages is called with some invalid messages", () => {
    it("should throw an error", () => {
      return deleteMessages(queueUrl, invalidMessages)
        .catch(err => expect(err.message).to.equal("Message must contain an Id and ReceiptHandle."));
    });
  });
});
