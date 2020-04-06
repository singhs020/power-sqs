const {expect} = require("chai");
const {stub} = require("sinon");

const getSendFifoMessagesFunc = require("../../src/operations/sendFifoMessages");

const queueUrl = "thisisaqueueUrl";
const group = "fooGrouop";
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
const sendFifoMessages = getSendFifoMessagesFunc(sqs);

describe("the sendFifoMessages Method", () => {
  describe("when sendFifoMessages is called without the queueUrl", () => {
    it("should throw an error", () => {
      return sendFifoMessages()
        .catch(err => expect(err.message).to.equal("Queue Url must be a valid string."));
    });
  });

  describe("when sendFifoMessages is called without the group", () => {
    it("should throw an error", () => {
      return sendFifoMessages(queueUrl)
        .catch(err => expect(err.message).to.equal("group must be a valid string."));
    });
  });

  describe("when sendFifoMessages is called without the messages", () => {
    it("should throw an error", () => {
      return sendFifoMessages(queueUrl, group)
        .catch(err => expect(err.message).to.equal("Messages must be an array."));
    });
  });

  describe("when sendFifoMessages is called with valid url and messages without any options", () => {
    it("should return the response", () => {
      return sendFifoMessages(queueUrl, group, messages)
        .then(res => {
          expect(res.successful).to.deep.equal(awsRes.Successful);
          expect(res.failed).to.deep.equal(awsRes.Failed);
          expect(res.entries[0].MessageBody).to.deep.equal(JSON.stringify({
            "body": messages[0]
          }));
          expect(res.entries[0].MessageGroupId).to.equal(group);
          expect(res.entries[1].MessageBody).to.deep.equal(JSON.stringify({
            "body": messages[1]
          }));
          expect(res.entries[1].MessageGroupId).to.equal(group);
          expect(res.entries[2].MessageBody).to.deep.equal(JSON.stringify({
            "body": messages[2]
          }));
          expect(res.entries[2].MessageGroupId).to.equal(group);
        });
    });
  });

  describe("when sendFifoMessages is called with valid url and messages and options", () => {
    it("should return the response", () => {
      return sendFifoMessages(queueUrl, group, messages, {"encode": true})
        .then(res => {
          expect(res.successful).to.deep.equal(awsRes.Successful);
          expect(res.failed).to.deep.equal(awsRes.Failed);
          expect(res.entries[0].MessageBody).to.deep.equal(JSON.stringify({
            "body": Buffer.from(JSON.stringify(messages[0])).toString("base64")
          }));
          expect(res.entries[0].MessageGroupId).to.equal(group);
          expect(res.entries[1].MessageBody).to.deep.equal(JSON.stringify({
            "body": Buffer.from(String(messages[1])).toString("base64")
          }));
          expect(res.entries[1].MessageGroupId).to.equal(group);
          expect(res.entries[2].MessageBody).to.deep.equal(JSON.stringify({
            "body": Buffer.from(String(messages[2])).toString("base64")
          }));
          expect(res.entries[2].MessageGroupId).to.equal(group);
        });
    });
  });
});
