function validFunc(func, name) {
  if (!func) return false;
  if (typeof func === "function") return true;
  else {
    throw new SyntaxError(`Invalid Function for Option: ${name}`);
  }
}

function validBool(bool, name) {
  if (!bool) return false;
  if (typeof bool === "boolean") return true;
  else {
    throw new SyntaxError(`Invalid Boolean for Option: ${name}`);
  }
}

function validString(str, name) {
  if (!str) return false;
  if (typeof str === "string") return true;
  else {
    throw new SyntaxError(`Invalid String for Option: ${name}`);
  }
}

function isObject(obj) {
  return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
}
module.exports = { validFunc, validBool, validString, isObject };
