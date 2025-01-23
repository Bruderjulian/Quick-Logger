const { createWriteStream, lstatSync } = require("fs");
const { join } = require("path");
const timestamp = require("time-stamp");
const { LogFileFormats, toLevelValue } = require("../src/utils.js");
const Transporter = require("../src/Transporter.js");

class FileTransporter extends Transporter {
  #stream;
  #id = 0;
  #level = 0;
  constructor(opts) {
    super();
    if (typeof opts.path !== "string") throw new TypeError("Invalid Path");
    if (!Object.values(LogFileFormats).includes(opts.format))
      throw new SyntaxError("Invalid File Logging Format");
    if (opts.loglevel) this.#level = toLevelValue(opts.loglevel);
    let path = opts.path;
    let fmt = opts.format;

    if (fmt.charAt(0) === "r") {
      if (isFolder(path)) path = join(path, "latest.log");
      this.#stream = createWriteStream(path, {
        encoding: "utf8",
        flags: fmt.charAt(1) || "a",
        autoClose: true,
      });
      return;
    }

    if (fmt.charAt(0) !== "n") return;
    if (isFolder(path)) {
      if (fmt.charAt(1) === "d") path = join(path, timestamp(opts.dateFormat));
      if (fmt.charAt(1) === "i") path = join(path, this.#id++);
    } else path = path + "-" + timestamp(opts.dateFormat);
    this.#stream = createWriteStream(path, {
      encoding: "utf8",
      autoClose: true,
    });
  }

  write(text, level) {
    if (level < this.#level) return;
    this.#stream.write(text + "\n");
  }
}

function isFolder(path) {
  try {
    return lstatSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}

module.exports = Transporter.create("File", FileTransporter);
