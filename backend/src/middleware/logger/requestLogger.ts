import morgan from "morgan";
import { requestLogger } from "./logger";

// Custom token to log the real client IP
morgan.token("real-ip", (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket.remoteAddress || "Unknown IP";
  return ip;
});

// Morgan middleware to log requests
const requestLoggingMiddleware = morgan(
  ":real-ip :method :url :status :response-time ms - :user-agent",
  { stream: { write: (message) => requestLogger.info(message.trim()) } }
);

export default requestLoggingMiddleware;
