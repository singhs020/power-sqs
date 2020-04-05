const {sendMessages} = require("../src/");

function init() {
  const queueUrl = "Your Queue URL";
  const messages = [{
      "foo": "bar"
    }, 
    "test"
  ];
  return sendMessages(queueUrl, messages)
  .then(res => console.log(res)); // eslint-disable-line no-console
}

init();
