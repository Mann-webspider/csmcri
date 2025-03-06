import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Content-Type", "application/json");
    const status = err instanceof CustomError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    
    
    res.status(status).json({ error: message ,statusCode:status,status:"error"});
};
