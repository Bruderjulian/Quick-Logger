const Transporter = require("../src/Transporter.js");
const process = require("process");

class StdoutTransporter extends Transporter {
  constructor() {
    super();
  }
  write(text) {
    process.stdout.write(text);
  }
}


module.exports = Transporter.create("Stdout", StdoutTransporter);;
