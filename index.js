const Logger = require("./src/Logger.js");
const Transporter = require("./src/Transporter.js");
const { LogFileFormats, LogLevels } = require("./src/utils.js");
const ConsoleTransporter = require("./transports/Console.js");
const StdoutTransporter = require("./transports/StdOut.js");
const StderrTransporter = require("./transports/Stderr.js");
const FileTransporter = require("./transports/File.js");

module.exports = {
  logger: new Logger(),
  Logger,
  LogLevels,
  LogFileFormats,
  Transporter,
  ConsoleTransporter,
  FileTransporter,
  StdoutTransporter,
  StderrTransporter,
};
