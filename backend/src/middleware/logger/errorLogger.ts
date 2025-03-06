import e, { Request, Response, NextFunction } from "express";
import { errorLogger } from "./logger";

export const errorLoggingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const logMessage = `${req.ip} ${req.method} ${req.url} - ${err.message}  `;

  // ✅ Log error to file
  errorLogger.error(logMessage);
  
  
    next(err)
//   res.status(500).json({ error: "Internal Server Error" });
};
