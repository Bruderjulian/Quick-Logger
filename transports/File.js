const { createWriteStream, lstatSync } = require("fs");
const Transporter = require("./transporter.js");
const { join } = require("path");
const timestamp = require("time-stamp");

class FileTransporter extends Transporter {
  #stream;
  constructor(opts) {
    super();
    if (typeof opts.path !== "string") throw new TypeError("Invalid Path");
    if (typeof opts.createNewFile !== "boolean")
      throw new TypeError("Invalid CreateNewFile Option");
    if (typeof opts.clearFile !== "boolean")
      throw new TypeError("Invalid ClearFile Option");

    let path = opts.path;
    if (!opts.createNewFile) {
      if (isFolder(path)) path = join(path, "latest.log");
      this.#stream = createWriteStream(path, {
        encoding: "utf8",
        flags: opts.clearFile ? "w" : "a",
        autoClose: true,
      });
      return;
    }

    if (isFolder(path)) path = join(path, timestamp(opts.dateFormat));
    else path = path + "-" + timestamp(opts.dateFormat);
    this.#stream = createWriteStream(path, {
      encoding: "utf8",
      autoClose: true,
    });
  }

  write(text) {
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
