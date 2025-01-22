class LogLevels {
  static silent = 0;
  static trace = 1;
  static debug = 2;
  static info = 3;
  static warn = 4;
  static error = 5;
  static fatal = 6;

  static isLevel(level) {
    return Object.values(this).includes(level);
  }

  static toName(level) {
    const keys = Object.keys(this);
    if (keys.includes(level)) return level;
    let idx = Object.values(this).indexOf(level);
    if (idx === -1) throw new EvalError("Could not parse Log Level");
    return keys[idx];
  }

  static toLevel(level) {
    let values = Object.values(this);
    if (values.includes(level)) return level;
    let idx = Object.keys(this).indexOf(level);
    if (idx === -1) throw new EvalError("Could not parse Log Level Name");
    return values[idx];
  }
}

module.exports = { LogLevels };
