const {deleteMessages} = require("../src/");

function init() {
  const queueUrl = "Your Queue URL";
  const messages = [];
  return deleteMessages(queueUrl, messages)
  .then(res => console.log(res)); // eslint-disable-line no-console
}

init();