import * as os from "os";
import {
  createLogger,
  format,
  transports,
  Logger as LoggerType,
} from "winston";


export type Logger = LoggerType;

const pid = process.pid;
const hostname = os.hostname();

const customFormat = format((info) => {
  info["time"] = Math.floor(Date.now());
  info["pid"] = pid;
  info["hostname"] = hostname;
  return info;
});

const jsonFormat = () =>
  format.printf(({ level, time, pid, hostname, message, ...info }) => {
    return `${JSON.stringify({
      level,
      time,
      pid,
      hostname,
      msg: message,
      ...info,
    })}`;
  });

let logger;

export const init = (): Logger => {
  if (logger) {
    return logger;
  }

  logger = createLogger({
    level: process.env.LOGGER_LEVEL,
    format: format.combine(customFormat(), jsonFormat()),
    transports: [new transports.Console()],
    exitOnError: true,
  });

  return logger;
};

export default { init };
