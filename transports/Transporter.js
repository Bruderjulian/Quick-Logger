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
    return Transporter[name];
  }
}

module.exports = Transporter;
