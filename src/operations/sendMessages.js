const assert = require("assert");
const {"v4": uuidV4} = require("uuid");

function getSendMessageFunc(sqs) {
  return async (queueUrl, messages) => {
    assert((queueUrl && typeof queueUrl === "string"), "Queue Url maust be a valid string.");
    assert((Array.isArray(messages) && messages.length > 0), "Messages must be an array.");

    const entries = messages.map(item => {
      const body = typeof item === "object" ? JSON.stringify(item) : String(item);
      return {
        "Id": uuidV4(),
        "MessageBody": Buffer.from(body).toString("base64")
      };
    });

    const params = {
      "QueueUrl": queueUrl,
      "Entries": entries
    };

    return await sqs.sendMessageBatch(params).promise();
  }
}

module.exports = getSendMessageFunc;
