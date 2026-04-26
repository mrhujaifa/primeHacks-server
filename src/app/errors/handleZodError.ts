import { ZodError } from "zod";
import httpStatus from "http-status";
import { TErrorResponse, TErrorSource } from "../types/error.type.js";

export const handleZodError = (error: ZodError): TErrorResponse => {
  const statusCode = httpStatus.BAD_REQUEST;
  const message = "Zod Validation Error";

  const errorSources: TErrorSource[] = [];

  error.issues.forEach((issue) => {
    errorSources.push({
      path:
        issue.path.length > 1
          ? issue.path.join(" => ")
          : String(issue.path[0] ?? ""),
      message: issue.message,
    });
  });

  return {
    success: false,
    statusCode,
    status: "fail",
    message,
    errorSources,
  };
};
