const {receiveMessages} = require("../src");

async function init() {
  const queueUrl = "Your Queue URL";
  const messages = await receiveMessages(queueUrl);
  console.log(messages); // eslint-disable-line no-console
}

init();