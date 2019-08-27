//morgan for console outputing in dev mode
const morgan = require("morgan");
//winston for file logging with much more details
const winston = require("winston");
const expressWinston = require("express-winston");

const rfs = require("rotating-file-stream");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");

const logsDir = path.join(appRoot.path, "logs");

fs.existsSync(logsDir) || fs.mkdirSync(logsDir);

const accesLoggerStream = rfs("access.log", {
  size: "10M",
  interval: "1d",
  path: path.join(appRoot.path, "logs")
});
const streamLogger = expressWinston.logger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [new winston.transports.Stream({ stream: accesLoggerStream })]
});
const consoleLogger = morgan("dev");

module.exports = { consoleLogger, streamLogger };
