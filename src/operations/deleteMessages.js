function getDeleteMessageFunc(sqs) {
  return (queueUrl, data) => {
    const messages = data.map(item => ({"Id": item.MessageId, "ReceiptHandle": item.ReceiptHandle}));

    const params = {
      "QueueUrl": queueUrl,
      "Entries": messages
    };

    return sqs.deleteMessageBatch(params).promise();
  }
}

module.exports = getDeleteMessageFunc;
