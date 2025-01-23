const { has, conversionMap } = require("./utils.js");

class Transporter {
  static create(name, cls) {
    if (typeof name !== "string" && name.length < 3) {
      throw new SyntaxError("Invalid Transporter Name");
    }
    const fn = function TransportCreator(opts) {
      return { cls, opts };
    };
    Transporter[name] = fn;
    return fn;
  }
  static load(name) {
    if (!has(Transporter, name)) {
      throw new SyntaxError("Could not find Transport: " + name);
    }
    return Transporter[name];
  }
  static parse(str = "") {
    if (typeof str !== "string")
      throw new TypeError("Invalid Transport Input Definition");
    var parts = str.split("+");
    if (parts.length === 0) return [];
    return parts.map((def) => {
      let idx = def.indexOf("(");
      if (idx === -1)
        throw new SyntaxError("Invalid Transport Input Definition");
      let name = def.slice(0, idx);
      idx = def.lastIndexOf("(");
      if (idx === -1)
        throw new SyntaxError("Invalid Transport Input Definition");
      let opts = def.slice(idx + 1, -1);
      opts = parseOptions(opts.split(","));
      return this.load(name)(opts);
    });
  }
}

function parseOptions(opts, v) {
  if (opts.length === 0) return {};
  return opts.reduce((prev, curr) => {
    curr = curr.split(":");
    if (curr.length == 0) return prev;
    if (curr.length == 1) v = curr[0];
    else v = curr[1];
    if (v.startsWith("LogLevels.")) {
      v = conversionMap[v.slice(10)];
    } else if (v.startsWith("LogFileFormats.")) {
      v = conversionMap[v.slice(15)];
    }
    if (typeof conversionMap === "undefined") {
      throw new SyntaxError(
        "Could not parse Option from Transports Input Definition"
      );
    }
    prev[curr[0]] = v;
    return prev;
  }, {});
}

module.exports = Transporter;
