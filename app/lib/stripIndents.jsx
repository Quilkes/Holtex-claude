// Function overloads are represented through JSDoc in JavaScript
/**
 * @param {string|TemplateStringsArray} arg0
 * @param {...any} values
 * @returns {string}
 */
export function stripIndents(arg0, ...values) {
  if (typeof arg0 !== "string") {
    const processedString = arg0.reduce((acc, curr, i) => {
      acc += curr + (values[i] ?? "");
      return acc;
    }, "");
    return _stripIndents(processedString);
  }
  return _stripIndents(arg0);
}

/**
 * @param {string} value
 * @returns {string}
 */
function _stripIndents(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trimStart()
    .replace(/[\r\n]$/, "");
}
