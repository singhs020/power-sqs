const {expect} = require("chai");
const {stub} = require("sinon");

const getReceiveMessagesFunc = require("../../src/operations/receiveMessages");

const queueUrl = "thisisaqueueUrl";
const success = {"message": "success"};
const sqs = {
  "receiveMessage": stub().returns({
    "promise": stub().resolves(success)
  })
};
const receiveMessages = getReceiveMessagesFunc(sqs);

describe("the receiveMessages Method", () => {
  describe("when receiveMessages is called without the queueUrl", () => {
    it("should throw an error", () => {
      return receiveMessages()
        .catch(err => expect(err.message).to.equal("Queue Url maust be a valid string."));
    });
  });

  describe("when receiveMessages is called with valid url", () => {
    it("should return the response", () => {
      return receiveMessages(queueUrl)
        .then(res => expect(res).to.deep.equal(success));
    });
  });
});
