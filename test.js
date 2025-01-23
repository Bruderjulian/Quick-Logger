const {
  Logger,
  LogLevels,
  LogFileFormats,
  ConsoleTransporter,
  FileTransporter,
  Transporter,
} = require("./index.js");

const logger = new Logger({
  namespace: "abc",
  loglevel: LogLevels.debug,
  dateFormat: "DD-MM-YYYY-HH",
  throwAtError: false,
  transports: [
    ConsoleTransporter({ useMethods: true }),
    FileTransporter({
      path: "logs/",
      format: LogFileFormats.clearedReuse,
      loglevel: LogLevels.warn,
    }),
    FileTransporter({
      path: "logs/temp",
      format: LogFileFormats.createWithDate,
    }),
    FileTransporter({ path: "logs/combined", format: LogFileFormats.reuse }),
  ],
  plugins: [],
});
const logger2 = logger.child({
  namespace: "a2",
  transports: Transporter.parse("Console(useMethods:true)"),
});
logger.info("hello");
logger.warn("Warning!");
logger2.info("some")

//console.log(Transporter.load("Console"));
//console.log(Transporter.load("File"));
