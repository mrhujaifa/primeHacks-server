/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

import AppError from "../../errors/AppError.js";
import { handleZodError } from "../../errors/handleZodError.js";
import { TErrorResponse, TErrorSources } from "../../types/error.type.js";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorStatus = statusCode < 500 ? "fail" : "error";
  let stack: string | undefined = undefined;
  let errorSources: TErrorSources = [];

  if (process.env.NODE_ENV === "development") {
    console.log("Error from Global Error Handler =>", err);
  }

  if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errorSources = zodError.errorSources;
    errorStatus = statusCode < 500 ? "fail" : "error";
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorStatus = err.status;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = err.message;
    errorStatus = "error";
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  if (process.env.NODE_ENV === "development") {
    stack = err.stack;
  }

  const errorResponse: TErrorResponse = {
    statusCode: statusCode,
    success: false,
    message,
    status: errorStatus,
    errorSources,
    stack,
    error: process.env.NODE_ENV === "development" ? err : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
