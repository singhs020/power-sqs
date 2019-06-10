
const AWS = require("aws-sdk");

const {Reader, Writer} = require("../operations");
const {SinkToSQS} = require("../providers");

const sqs = new AWS.SQS({
  "apiVersion": "2012-11-05"
});

const logger = console;
const url = "https://sqs.ap-south-1.amazonaws.com/250985222349/test2";
const destUrl = "https://sqs.ap-south-1.amazonaws.com/250985222349/test";

module.exports = () => {
  const destConfig = {"url": destUrl};
  const provider = new SinkToSQS({"config": destConfig, logger});
  const reader = new Reader({url, logger});
  const writer = new Writer({provider, logger, "sourceUrl": url, sqs});

  reader.pipe(writer);
}
