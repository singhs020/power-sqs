const assert = require("assert");

function getReceiveMessagesFunc(sqs) {
  return async (queueUrl) => {
    assert((queueUrl && typeof queueUrl === "string"), "Queue Url maust be a valid string.");

    const params = {
      "QueueUrl": queueUrl,
      "MaxNumberOfMessages": 10
    };

    return await sqs.receiveMessage(params).promise();
  }
}

module.exports = getReceiveMessagesFunc;
