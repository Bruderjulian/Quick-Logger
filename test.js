const { Logger, LogLevels, ConsoleTransporter, FileTransporter } = require("./index.js");

const logger = new Logger({
  name: "abc",
  loglevel: LogLevels.debug,
  dateFormat: "DD-MM-YYYY-HH",
  transports: [
    ConsoleTransporter({ useMethods: true }),
    FileTransporter({path: "logs/", createNewFile: false, clearFile: false}),
    FileTransporter({path: "logs/temp", createNewFile: true, clearFile: false}),
  ],
});
logger.info("hello");
//console.log(Transporter.load("Console"));
//console.log(Transporter.load("File"));
