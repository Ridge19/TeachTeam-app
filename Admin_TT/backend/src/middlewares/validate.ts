import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

// Middleware to validate DTOs using class-validator and class-transformer
// This middleware will transform the request body into an instance of the specified DTO class
// and validate it against the defined validation rules.

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req.body);
    const errors = await validate(instance, { whitelist: true });

    if (errors.length > 0) {
      return res.status(400).json({
        errors: errors.map((e) => ({
          property: e.property,
          constraints: e.constraints,
        })),
      });
    }

    // replace body with validated and transformed instance
    req.body = instance;
    next();
  };
}
