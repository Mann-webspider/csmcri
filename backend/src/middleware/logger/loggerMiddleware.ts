import morgan from "morgan";
import { requestLogger } from "./logger";
import { getMacAddress } from "../../utils/macAddress";

morgan.token("real-ip", (req) => {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";
  if (Array.isArray(ip)) ip = ip[0];
  return ip;
});

morgan.token("mac", (req) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  return ip ? getMacAddress(ip as string) : "MAC not available";
});

// Morgan middleware for logging requests
const requestLoggingMiddleware = morgan(
  ":real-ip  :method :url :status :response-time ms - :user-agent",
  { stream: { write: (message) => requestLogger.info(message.trim()) } }
);

export default requestLoggingMiddleware;
