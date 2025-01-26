class LogLevels {
  static silent = 0;
  static trace = 1;
  static debug = 2;
  static info = 3;
  static warn = 4;
  static error = 5;
  static fatal = 6;
}

class LogFileFormats {
  static createNew = "nd";
  static createWithDate = "nd";
  static createWithId = "ni";
  static reuse = "ra";
  static clearedReuse = "rw";
}

const levelMap = {
  0: "silent",
  1: "trace",
  2: "debug",
  3: "info",
  4: "warn",
  5: "error",
  6: "fatal",
};

const conversionMap = {
  nd: "createNew",
  nd: "createWithDate",
  ni: "createWithId",
  ra: "reuse",
  rw: "clearedReuse",
  ...levelMap,
};

const has = Object.hasOwn || Object.call.bind(Object.hasOwnProperty);
function isObject(obj) {
  return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
}

function toLevelName(v) {
  if (has(levelMap, v)) return levelMap[v];
  if (has(LogLevels, v)) return v;
  throw new SyntaxError("Invalid Log Level");
}

function toLevelValue(v) {
  if (has(LogLevels, v)) return LogLevels[v];
  if (has(levelMap, v)) return v;
  throw new SyntaxError("Invalid Log Level");
}

class LogError extends Error {
  constructor(text) {
    super("");
    this.stack = text + this.stack.replace("Error", "");
  }
}

module.exports = {
  isObject,
  toLevelName,
  toLevelValue,
  has,
  LogLevels,
  LogFileFormats,
  LogError,
  conversionMap,
};
