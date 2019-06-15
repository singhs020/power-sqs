const {getReader, getBulkReader} = require("./reader");
const getWriter = require("./writer");
const getBulkRemover = require("./remover");

module.exports = {
  getReader,
  getWriter,
  getBulkReader,
  getBulkRemover
};
