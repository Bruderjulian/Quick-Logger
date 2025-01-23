const { Logger, LogLevels, ConsoleTransporter, FileTransporter } = require("./index.js");
const { LogFileFormats } = require("./src/constants.js");

const logger = new Logger({
  name: "abc",
  loglevel: LogLevels.debug,
  dateFormat: "DD-MM-YYYY-HH",
  transports: [
    ConsoleTransporter({ useMethods: true }),
    FileTransporter({path: "logs/", format: LogFileFormats.clearedReuse, loglevel: LogLevels.warn}),
    //FileTransporter({path: "logs/temp", format: LogFileFormats.createWithDate}),
    FileTransporter({path: "logs/combined", format: LogFileFormats.reuse}),
  ],
});
logger.info("hello");
logger.warn("Warning!");

//console.log(Transporter.load("Console"));
//console.log(Transporter.load("File"));
