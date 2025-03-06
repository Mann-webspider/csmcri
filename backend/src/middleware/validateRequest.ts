import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { CustomError } from "./errors/CustomError";

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        throw new CustomError(error.message,400)
    }
    next(error);
  };
};
