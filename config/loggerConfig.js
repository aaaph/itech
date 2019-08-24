const logger = require("morgan");
const rfs = require("rotating-file-stream");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");

const logsDir = path.join(appRoot.path, "logs");

fs.existsSync(logsDir) || fs.mkdirSync(logsDir);

const accesLoggerStream = rfs("access.log", {
  interval: "1d",
  path: path.join(appRoot.path, "logs")
});
const consoleLogger = logger("dev");
const fileLogger = logger(
  ':remote-addr - :remote-user [:date[web] ":method :url HTTP/:http-version" status-:status content-length-:res[content-length] time-:response-time[digits] ms ',
  { stream: accesLoggerStream }
);
module.exports = { consoleLogger, fileLogger };
