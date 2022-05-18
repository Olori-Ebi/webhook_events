import { Response } from "express";

const errorResponse = (res: Response, message: string, statusCode = 500, error = {}) => {
    res.status(statusCode).json({
      success: false,
      message,
      error: {
        statusCode,
        message,
        error,
      },
    });
  };

export default errorResponse