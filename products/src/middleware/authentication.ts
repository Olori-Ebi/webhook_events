import { verifyToken } from "../utils/auth";
import { NextFunction, Request, Response } from "express";
import errorResponse from "../utils/errorHandler";

interface UserPayload {
    email: string;
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            user: UserPayload
        }
    }
}

const verifyAuthHeader = (req: Request) => {
  const token = req.headers.auth_token;
  const payload = verifyToken(token as string);
  if (!token) return { error: "authentication error" };
  if (!payload) return { error: "token error" };
  return payload;
};

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const payload: any = verifyAuthHeader(req);
  let error: string;
  let statusCode: number;

  if (payload && payload.error === "authentication error") {
    statusCode = 401;
    error = "No authorization header was specified";
    return errorResponse(res, error, statusCode, true)
  }
  if (payload && payload.error === "token error") {
    statusCode = 401;
    error = "Token provided cannot be authenticated";
    return errorResponse(res, error, statusCode, true)
  }
  req.user = payload;
  next();
};