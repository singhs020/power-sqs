const assert = require("assert");
const {"v4": uuidV4} = require("uuid");

function getSendMessageFunc(sqs) {
  return async (queueUrl, messages, options = {}) => {
    assert((queueUrl && typeof queueUrl === "string"), "Queue Url must be a valid string.");
    assert((Array.isArray(messages) && messages.length > 0), "Messages must be an array.");

    const {useWrapper = true} = options;

    const entries = messages.map(item => {
      const strBody = typeof item === "object" ? JSON.stringify(item) : String(item);

      const body = options.encode === true ? Buffer.from(strBody).toString("base64") : item;
      return {
        "Id": uuidV4(),
        "MessageBody": useWrapper === true ? JSON.stringify({"body": body}) : JSON.stringify(item)
      };
    });

    const params = {
      "QueueUrl": queueUrl,
      "Entries": entries
    };

    const {Failed, Successful}  = await sqs.sendMessageBatch(params).promise();

    return {
      "failed": Failed,
      "successful": Successful,
      "entries": entries
    };
  }
}

module.exports = getSendMessageFunc;
