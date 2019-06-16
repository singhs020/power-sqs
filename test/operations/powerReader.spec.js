const {assert} = require("chai");
const highland = require("highland");
const {spy} = require("sinon");

const {getPowerReader} = require("../../src/operations");

const url = "foo:bar";
const config = {url};
const messages = {
  "Messages": [{"foo": "bar"}]
};
const sqs = {
  "receiveMessage": spy((params, cb) => {
    cb(null, messages);
  })
};

describe("The Power Reader", () => {
  it("should return a highland stream", () => {
    const powerReader = getPowerReader(config, sqs);

    assert.isTrue(highland.isStream(powerReader));
  });
});
