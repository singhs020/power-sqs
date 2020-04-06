const {getReader, getBulkReader} = require("./reader");
const {getPowerReader} = require("./powerReader");
const getWriter = require("./writer");
const getBulkRemover = require("./remover");
const getDeleteMessageFunc = require("./deleteMessages");
const getSendMessageFunc = require("./sendMessages");
const getSendMessageFifoFunc = require("./sendMessagesFifo");
const getReceiveMessagesFunc = require("./receiveMessages");

module.exports = {
  getReader,
  getWriter,
  getBulkReader,
  getBulkRemover,
  getPowerReader,
  getDeleteMessageFunc,
  getSendMessageFunc,
  getReceiveMessagesFunc,
  getSendMessageFifoFunc
};
