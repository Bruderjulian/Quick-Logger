const Transporter = require("../src/Transporter.js");
const { isObject } = require("../src/utils.js");

const methodMap = {
  0: () => {},
  1: console.trace,
  2: console.log,
  3: console.log,
  4: console.warn,
  5: console.error,
  6: (err) => {
    throw err;
  },
};

class ConsoleTransporter extends Transporter {
  #useMethods = false;
  constructor(opts) {
    super();
    if (!isObject(opts)) throw new SyntaxError("Invalid Options");
    if (typeof opts.useMethods === "boolean") {
      this.#useMethods = opts.useMethods;
    }
  }

  write(text, level) {
    if (this.#useMethods) {
      methodMap[level](text);
    } else console.log(text);
  }
}

module.exports = Transporter.create("Console", ConsoleTransporter);
