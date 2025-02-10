"use strict";
import * as stream from "stream";
import {
  validFunc,
  validBool,
  isObject,
  validString,
} from "./transport_utils.js";

const stored = {};
class Transport {
  constructor(
    options = {
      level: 3,
      format: (m) => m,
      log: () => {},
    },
    name
  ) {
    if (!isObject(options)) {
      throw new SyntaxError("Invalid Options Object");
    }
    if (validString(name)) this.name = name;
    if (validBool(options.level, "level")) this.level = options.level;
    if (validBool(options.silent, "silent")) this.silent = options.silent;
    if (validBool(options.handleExceptions, "handleExceptions")) {
      this.handleExceptions = options.handleExceptions;
    }
    if (validBool(options.handleRejections, "handleRejections")) {
      this.handleRejections = options.handleRejections;
    }

    if (validFunc(options.format, "format")) this.format = options.format;
    if (validFunc(options.log, "log")) this.log = options.log;
    if (validFunc(options.open, "open")) this._open = options.open;
    if (validFunc(options.close, "close")) this._close = options.close;

    this.once("pipe", (logger) => {
      this.levels = logger.levels;
      this.parent = logger;
      if (logger.autoOpen) this.open();
    });
    this.once("unpipe", (src) => {
      if (src === this.parent) return;
      this.parent = null;
      this.close();
    });
  }

  open(callback) {
    this.stream = new stream.Writable({ objectMode: true });
    if (this._open) this._open.call(this);
    if (typeof callback === "function") callback.call(this);
  }

  close(callback) {
    if (this._close) this._close.call(this);
    if (typeof callback === "function") callback.call(this);
    this.stream.end(`Ended Transport ${this.name}`, "utf8");
  }

  _write(info, callback) {
    if (this.parent === null || this.stream.closed)
      throw new Error("Transport not initialized");
    if (this.silent || (info.exception === true && !this.handleExceptions)) {
      return callback(null);
    }

    const level = this.level || (this.parent && this.parent.level);
    if (
      !level ||
      !info.level ||
      this.levels[level] >= this.levels[info.level]
    ) {
      return callback(null);
    }

    if (!this.format) return this.log(info, callback);
    let errState;
    let transformed;
    try {
      transformed = this.format(Object.assign({}, info), this.options);
    } catch (err) {
      errState = err;
    }
    if (!transformed || errState) {
      callback(errState);
      if (errState) throw errState;
    }

    return this.log(transformed, callback);
  }

  static create(name, cls) {
    if (typeof name !== "string" && name.length < 3) {
      throw new SyntaxError("Invalid Transporter Name");
    }
    if (stored.hasOwnProperty(name)) {
      throw new Error("Can't override existing Transport");
    }
    cls.name = name;
    return (stored[name] = cls);
  }

  static load(name, exists = true) {
    if (!exists || stored.hasOwnProperty(name)) return stored[name];
    else throw new Error(`Transport ${name} is not defined`);
  }
}

module.exports = Transport;
