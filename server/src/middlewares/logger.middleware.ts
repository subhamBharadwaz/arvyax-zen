import pino from "pino";
import env from "../env";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
      singleLine: false,
    },
  },
  level: env.LOG_LEVEL || "info",
});

export default logger;
