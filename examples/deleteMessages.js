const {receiveMessages, deleteMessages} = require("../src");

async function init() {
  const queueUrl = "Your Queue URL";
  const messages = await receiveMessages(queueUrl);
  return deleteMessages(queueUrl, messages.Messages).then(res => console.log(res)); // eslint-disable-line no-console
}

init();