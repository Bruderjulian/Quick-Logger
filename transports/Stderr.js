const Transporter = require("../src/Transporter.js");
const process = require("process");

class StderrTransporter extends Transporter {
  constructor() {
    super();
  }
  write(text, level) {
    if (level < 5) return;
    process.stderr.write(text);
  }
}

module.exports = Transporter.create("Stderr", StderrTransporter);
