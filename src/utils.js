const Transporter = require("../transports/transporter.js");

function isObject(obj) {
  return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
}

function validTransport(transport) {
  return isObject(transport) && typeof transport.cls === "function" && transport.cls.toString().includes("extends Transporter");
}

function extractTransports(arr, defaultOps) {
  if (typeof arr === "undefined") return [];
  if (typeof arr === "string") arr = Transporter.load(arr);
  if (validTransport(arr)) arr = [arr];
  if (!Array.isArray(arr) || !arr.every((v)=> validTransport(v))) {
    throw new SyntaxError("Invalid Transport Creator at Extraction");
  }
  return arr.map((v) => {
    return new v.cls({...defaultOps, ...v.opts});
  })
}

class LogError extends Error {
  constructor(text) {
    super("");
    this.stack = text + this.stack.replace("Error", "");
  }
}

module.exports = { isObject, extractTransports, LogError };
