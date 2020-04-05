const assert = require("assert");

function getDeleteMessageFunc(sqs) {
  return async (queueUrl, messages) => {
    assert((queueUrl && typeof queueUrl === "string"), "Queue Url maust be a valid string.");
    assert((Array.isArray(messages) && messages.length > 0), "Messages must be an array of messages from sqs.");

    // validate messages
    messages.forEach(msg => {
      assert((msg.MessageId && msg.ReceiptHandle), "Message must contain an Id and ReceiptHandle.");
    });

    const entries = messages.map(item => ({"Id": item.MessageId, "ReceiptHandle": item.ReceiptHandle}));

    const params = {
      "QueueUrl": queueUrl,
      "Entries": entries
    };

    return await sqs.deleteMessageBatch(params).promise();
  }
}

module.exports = getDeleteMessageFunc;
