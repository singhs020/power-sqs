const {expect} = require("chai");
const {stub} = require("sinon");

const getDeleteMessageFunc = require("../../src/operations/deleteMessages");

const queueUrl = "thisisaqueueUrl";
const validMessages = [{
  "MessageId": "foo",
  "ReceiptHandle": "bar"
}];
const invalidMessages = [
  ...validMessages,
  {
    "Id": "invalidFoo"
  }
];
const awsRes = {
  "Failed": [],
  "Successful": []
};
const sqs = {
  "deleteMessageBatch": stub().returns({
    "promise": stub().resolves(awsRes)
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

  describe("when deleteMessages is called with valid messages", () => {
    it("should return the response", () => {
      return deleteMessages(queueUrl, validMessages)
        .then(res => expect(res).to.deep.equal({
          "failed": awsRes.Failed,
          "successful": awsRes.Successful
        }));
    });
  });
});
