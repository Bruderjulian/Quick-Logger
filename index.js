const { LogLevels, LogFileFormats } = require("./src/constants");
const Logger = require("./src/Logger");
const Transporter = require("./transports/transporter");


const ConsoleTransporter = require("./transports/Console.js");
const StdoutTransporter = require("./transports/StdOut.js");
const StderrTransporter = require("./transports/Stderr.js");
const FileTransporter = require("./transports/File.js");

module.exports = {
  Logger,
  LogLevels,
  LogFileFormats,
  Transporter,
  ConsoleTransporter,
  FileTransporter,
  StdoutTransporter,
  StderrTransporter,
};
