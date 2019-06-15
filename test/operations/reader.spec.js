const {assert} = require("chai");
const {getReader} = require("../../src/operations");

describe("The Reader Stream", () => {
  describe("The config validation", () => {
    it("should throw an error when url is not passed in config", () => {
      assert.throw(() => getReader({}), "The SQS Url is required by the Reader");
    });
  });
});