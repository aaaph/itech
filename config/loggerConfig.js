const logger = require("morgan");
const rfs = require("rotating-file-stream");
const path = require("path");
const appRoot = require("app-root-path");

const accesLoggerStream = rfs("access.log", {
  interval: "1d",
  path: path.join(appRoot.path, "logs")
});
const consoleLogger = logger("dev");
const fileLogger = logger("combined", { stream: accesLoggerStream });
module.exports = { consoleLogger, fileLogger };
