const {getReader, getBulkReader} = require("./reader");
const {getPowerReader} = require("./powerReader");
const getWriter = require("./writer");
const getBulkRemover = require("./remover");
const getDeleteMessageFunc = require("./deleteMessages");
const getSendMessageFunc = require("./sendMessages");

module.exports = {
  getReader,
  getWriter,
  getBulkReader,
  getBulkRemover,
  getPowerReader,
  getDeleteMessageFunc,
  getSendMessageFunc
};
