import { NextFunction, Request, Response } from "express";
import { Type } from "../payload";
import errorResponse from "../utils/errorHandler";
import validator from "./validation";

declare global {
    namespace Express {
        interface Request {
            params: any
        }
    }
}


export const validateSignupRequest = (req: Request, res: Response, next: NextFunction) => {
    const validated = validator.validateSignup(req.body);
    
    if (validated.error) {
        return handleValidationError(validated.error, res);
    }
    return next();
};

export const validateSigninRequest = (req: Request, res: Response, next: NextFunction) => {
    const validated = validator.validateSignin(req.body);
    
    if (validated.error) {
        return handleValidationError(validated.error, res);
    }
    return next();
};

export const validateAddressRequest = (req: Request, res: Response, next: NextFunction) => {
    const validated = validator.validateAddress(req.body);
    
    if (validated.error) {
        return handleValidationError(validated.error, res);
    }
    return next();
};

export const validateProductRequest = (req: Request, res: Response, next: NextFunction) => {
    const validated = validator.validateProduct(req.body);
    
    if (validated.error) {
        return handleValidationError(validated.error, res);
    }
    return next();
};

// export const validateTypeRequest = (req: Request, res: Response, next: NextFunction) => {
//     const validated = validator.validateType(req.params);
    
//     if (validated.error) {
//         return handleValidationError(validated.error, res);
//     }
//     return next();
// };

const handleValidationError = (validationError: any, res: Response) => {
    const message = validationError.details[0].message;
    return errorResponse(res, message, 400, true)
};