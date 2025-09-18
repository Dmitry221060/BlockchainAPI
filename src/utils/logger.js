/* eslint-disable */
const winston = require("winston");
const { inspect } = require("util");
const path = require("path");
const fs = require("fs");
const { formatTimestamp } = require("./util");

const LOG_TO_CONSOLE = process.env.LOG_TO_CONSOLE === true;
const { combine, colorize, printf } = winston.format;

const leveling = winston.format((info, level) => info.level !== level ? null : info);
const timestamp = winston.format((info, short = false) => {
  info.timestamp = formatTimestamp();
  const offsetToTime = 12;
  if (short) info.timestamp = `[${info.timestamp.substring(offsetToTime)}`;
  return info;
});

const FileFormat = (level) => {
  return combine(
    leveling(level),
    timestamp(false),
    printf(info => {
      let meta = "";
      for (const obj of info.meta) meta += `\r\n${inspect(obj).replace(/\r?\n/g, "\r\n")}`;
      return `${info.timestamp} ${info.level}: ${info.message}${meta}`;
    })
  );
};

const ConsoleFormat = (level) => {
  return combine(
    leveling(level),
    colorize(),
    timestamp(true),
    printf(info => {
      let meta = "";
      for (const obj of info.meta) meta += `\r\n${inspect(obj, { colors: true })}`;
      return `${info.timestamp} ${info.level}: ${info.message}${meta}`;
    })
  );
};

winston.addColors({
  error: "red",
  info:  "yellow",
  debug: "blue"
});

const logger = winston.createLogger({
  levels: {
    error: 0,
    info:  1,
    debug: 2
  },
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/Errors.txt"),
      level: "error",
      format: FileFormat("error")
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/Info.txt"),
      level: "info",
      format: FileFormat("info")
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/Debug.txt"),
      level: "debug",
      format: FileFormat("debug")
    }),
    new winston.transports.Console({
      silent: !LOG_TO_CONSOLE,
      level: "error",
      format: ConsoleFormat("error")
    }),
    new winston.transports.Console({
      silent: !LOG_TO_CONSOLE,
      level: "info",
      format: ConsoleFormat("info")
    }),
    new winston.transports.Console({
      silent: !LOG_TO_CONSOLE,
      level: "debug",
      format: ConsoleFormat("debug")
    })
  ]
});

process.on("uncaughtException", fatalError);
process.on("unhandledRejection", fatalError);

function fatalError(error) {
  console.error(error);
  fs.appendFileSync("../../logs/Errors.txt", `\r\n${formatTimestamp()} ${error ? error.stack : error}`);
  const forceQuitTimeout = 1000;
  setTimeout(() => process.exit(1), forceQuitTimeout).unref();
}

module.exports = {
  error: (msg, ...splat) => module.exports.log("error", msg, splat),
  info:  (msg, ...splat) => module.exports.log("info", msg, splat),
  debug: (msg, ...splat) => module.exports.log("debug", msg, splat),
  log: (level, msg, splat) => {
    if (typeof msg !== "string") msg = inspect(msg);
    for (const meta of splat) if (meta instanceof Error && meta.message && meta.stack) meta.message = null;
    logger.log(level, msg, { meta: splat });
  }
};
