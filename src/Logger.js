const timestamp = require("time-stamp").utc;
const { LogLevels } = require("./constants.js");
const { isObject, extractTransports, LogError } = require("./utils.js");

class Logger {
  #namespace = "";
  #loglevel = LogLevels.info;
  #dateFormat = "DD-MM-YYYY HH-mm-ss";
  #transports = [];
  #formatter = this.#defaultFormatter;
  #throwAtError = false;

  constructor(opts) {
    if (typeof opts === "string") opts = { name: opts };
    if (!isObject(opts)) throw new TypeError("Invalid Option Type");
    if (typeof opts.name === "string" && opts.name.length > 0) {
      this.#namespace = " " + opts.name;
    }
    if (typeof opts.namespace === "string" && opts.namespace.length > 0) {
      this.#namespace = " " + opts.namespace;
    }
    if (opts.loglevel) {
      opts.loglevel = LogLevels.toLevel(opts.loglevel);
      if (LogLevels.isLevel(opts.loglevel)) this.#loglevel = opts.loglevel;
    }
    if (opts.dateFormat) {
      this.#dateFormat = opts.dateFormat;
    }
    if (typeof opts.formatter === "function") {
      this.#formatter = opts.formatter;
    }
    if (typeof opts.throwAtError === "boolean") {
      this.#throwAtError = opts.throwAtError;
    }
    this.#transports = extractTransports(opts.transports, {
      dateFormat: this.#dateFormat,
    });
  }

  log(...message) {
    this.#createLog(level, message);
  }

  info(...message) {
    this.#createLog(LogLevels.info, message);
  }

  debug(...message) {
    this.#createLog(LogLevels.debug, message);
  }

  warn(...message) {
    this.#createLog(LogLevels.warn, message);
  }

  error(...message) {
    this.#createLog(LogLevels.error, message);
  }

  fatal(...message) {
    this.#createLog(LogLevels.fatal, message);
  }

  #createLog(level, message) {
    if (level < this.#loglevel) return;
    message = message.join(" ");
    var date = timestamp(this.#dateFormat);
    var text = this.#formatter(
      message,
      LogLevels.toName(level),
      date,
      this.#namespace
    );
    if (
      level === LogLevels.fatal ||
      (this.#throwAtError && level === LogLevels.error)
    ) {
      throw new LogError(text);
    }
    for (let i = 0, len = this.#transports.length; i < len; i++) {
      this.#transports[i].write(text, level);
    }
  }

  #defaultFormatter(message, level, timestamp, namespace) {
    return `[${timestamp}] [${level.toUpperCase()}]${namespace} - ${message}`;
  }
}

module.exports = Logger;
