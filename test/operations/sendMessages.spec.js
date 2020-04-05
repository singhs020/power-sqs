const {expect} = require("chai");
const {stub} = require("sinon");

const getSendMessagesFunc = require("../../src/operations/sendMessages");

const queueUrl = "thisisaqueueUrl";
const awsRes = {
  "Successful": [],
  "Failed": []
};
const messages = [{
  "foo": "bar"
}, "test", 1];
const sqs = {
  "sendMessageBatch": stub().returns({
    "promise": stub().resolves(awsRes)
  })
};
const sendMessages = getSendMessagesFunc(sqs);

describe("the sendMessages Method", () => {
  describe("when sendMessages is called without the queueUrl", () => {
    it("should throw an error", () => {
      return sendMessages()
        .catch(err => expect(err.message).to.equal("Queue Url maust be a valid string."));
    });
  });

  describe("when sendMessages is called without the messages", () => {
    it("should throw an error", () => {
      return sendMessages(queueUrl)
        .catch(err => expect(err.message).to.equal("Messages must be an array."));
    });
  });

  describe("when sendMessages is called with valid url and messages without any options", () => {
    it("should return the response", () => {
      return sendMessages(queueUrl, messages)
        .then(res => {
          expect(res.successful).to.deep.equal(awsRes.Successful);
          expect(res.failed).to.deep.equal(awsRes.Failed);
          expect(res.entries[0].MessageBody).to.deep.equal(JSON.stringify({
            "body": messages[0]
          }));
          expect(res.entries[1].MessageBody).to.deep.equal(JSON.stringify({
            "body": messages[1]
          }));
          expect(res.entries[2].MessageBody).to.deep.equal(JSON.stringify({
            "body": messages[2]
          }));
        });
    });
  });

  describe("when sendMessages is called with valid url and messages and options", () => {
    it("should return the response", () => {
      return sendMessages(queueUrl, messages, {"encode": true})
        .then(res => {
          expect(res.successful).to.deep.equal(awsRes.Successful);
          expect(res.failed).to.deep.equal(awsRes.Failed);
          expect(res.entries[0].MessageBody).to.deep.equal(JSON.stringify({
            "body": Buffer.from(JSON.stringify(messages[0])).toString("base64")
          }));
          expect(res.entries[1].MessageBody).to.deep.equal(JSON.stringify({
            "body": Buffer.from(String(messages[1])).toString("base64")
          }));
          expect(res.entries[2].MessageBody).to.deep.equal(JSON.stringify({
            "body": Buffer.from(String(messages[2])).toString("base64")
          }));
        });
    });
  });
});
