
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "./errors/CustomError";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable
// Create a custom interface for requests with a user
interface AuthRequest extends Request {
    user?: { user_id: string };
  }
export const verifyToken = (req: Request, res: Response, next: NextFunction):void => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer Token

  if (!token) {
    res.status(401).json({ error: "Access Denied. No token provided." });
    return
}

  try {
    const tokenExp:any = jwt.decode(token)
    if (tokenExp.exp < (new Date().getTime() + 1) / 1000) {
                    throw new CustomError("Token expired",400)
                }
    const decoded = jwt.verify(token, SECRET_KEY) as { user_id: string };
    (req as AuthRequest).user = decoded; // ✅ Type assertion to add `user`
    next();
  } catch (err) {
      res.status(403).json({ error: "Invalid or expired token." });
      return 
  }
};
