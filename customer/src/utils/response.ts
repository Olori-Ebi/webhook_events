import { Response } from "express";

const successResponse = (res: Response, content: any, message: string, statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data: {
        statusCode,
        data: content,
      },
    });
  };

export default successResponse