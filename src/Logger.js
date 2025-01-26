const timestamp = require("time-stamp").utc;
const {
  isObject,
  toLevelName,
  toLevelValue,
  LogLevels,
  LogError,
} = require("./utils.js");
const Transporter = require("./Transporter.js");

class Logger {
  #namespace = "";
  #loglevel = LogLevels.info;
  #dateFormat = "DD-MM-YYYY HH-mm-ss";
  #transports = [];
  #formatter = this.#defaultFormatter;
  #throwAtError = false;

  constructor(opts) {
    if (typeof opts === "undefined") return;
    if (typeof opts === "string") opts = { name: opts };
    if (!isObject(opts)) throw new TypeError("Invalid Option Type");
    if (typeof opts.namespace === "string" && opts.namespace.length > 0) {
      this.#namespace = " " + opts.namespace;
    }
    if (typeof opts.name === "string" && opts.name.length > 0) {
      this.#namespace = " " + opts.name;
    }
    opts.loglevel = opts.loglevel ?? opts.logLevel ?? opts.LogLevel;
    if (opts.loglevel) {
      this.#loglevel = toLevelValue(opts.loglevel);
    }
    if (typeof opts.dateFormat === "string") {
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

  static getLogger(opts) {
    return new Logger(opts);
  }

  static createLogger(opts) {
    return new Logger(opts);
  }

  static from(instance, opts) {
    if (!(instance instanceof Logger))
      throw new SyntaxError("Invalid Instance to clone from");
    return instance.derive(opts);
  }

  clone() {
    return new Logger(this);
  }

  derive(opts) {
    if (typeof opts === "undefined") return new Logger(this);
    if (typeof opts === "string") opts = { name: opts };
    if (!isObject(opts)) throw new TypeError("Invalid Options Type");
    var mergedOpts = {
      namespace: opts.namespace ?? opts.name ?? this.#namespace,
      loglevel: opts.loglevel ?? this.#loglevel,
      dateFormat: opts.dateFormat ?? this.#dateFormat,
      throwAtError: opts.throwAtError ?? this.#throwAtError,
      formatter: opts.formatter ?? this.#formatter,
      transports: opts.transports
        ? extractTransports(opts.transports)
        : this.#transports,
    };
    return new Logger(mergedOpts);
  }

  child(opts) {
    return this.derive(opts);
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
    if (
      level < this.#loglevel ||
      (this.#throwAtError && level < LogLevels.error) ||
      this.#transports.length === 0
    ) {
      return;
    }
    message = message.join(" ");
    var date = timestamp(this.#dateFormat);
    var text = this.#formatter(
      message,
      toLevelName(level),
      date,
      this.#namespace
    );
    if (this.#throwAtError && level >= LogLevels.error) {
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

function validTransport(transport) {
  return (
    transport instanceof Transporter ||
    (isObject(transport) &&
      typeof transport.cls === "function" &&
      transport.cls.toString().includes("extends Transporter"))
  );
}

function extractTransports(arr, defaultOpts) {
  if (typeof arr === "undefined") return [];
  else if (typeof arr === "string") arr = [Transporter.load(arr)];
  else if (validTransport(arr)) arr = [arr];
  if (!Array.isArray(arr)) throw new SyntaxError("Invalid Transport Creator");
  return arr.map((v) => {
    if (v instanceof Transporter) return v;
    if (!validTransport(v)) throw new SyntaxError("Invalid Transport Creator");
    return new v.cls({ ...defaultOpts, ...v.opts });
  });
}

module.exports = Logger;
