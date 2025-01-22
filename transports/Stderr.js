const { LogLevels } = require("../src/constants.js");
const Transporter = require("./transporter.js");
const process = require("process");

class StderrTransporter extends Transporter {
  constructor() {
    super();
  }
  write(text, level) {
    if (level < LogLevels.error) return;
    process.stderr.write(text);
  }
}

module.exports = Transporter.create("Stderr", StderrTransporter);
