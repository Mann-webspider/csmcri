import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

// Ensure the logs directory exists
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log format
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

// Request logger
export const requestLogger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.File({ filename: path.join(logsDir, "requests.log") }),
    new transports.Console()
  ]
});

// Error logger
export const errorLogger = createLogger({
  level: "error",
  format: logFormat,
  transports: [
    new transports.File({ filename: path.join(logsDir, "error.log") }),
    new transports.Console()
  ]
});
