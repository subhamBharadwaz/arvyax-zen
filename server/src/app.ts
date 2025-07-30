import dotenv from "dotenv";

dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { BaseError, ErrorHandler, logger } from "./utils";
import { HttpStatusCode } from "./types/http.model";

const app = express();

const errorHandler = new ErrorHandler(logger);

// cors
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

// regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies middleware
app.use(cookieParser());

// set security headers
app.use(helmet());

// Handling errors
app.use(errorMiddleware);

process.on("uncaughtException", async (error: Error) => {
  await errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) process.exit(1);
});

process.on("unhandledRejection", (reason: Error) => {
  throw reason;
});

async function errorMiddleware(
  error: BaseError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!errorHandler.isTrustedError(error)) {
    res.json({
      error: "Something went wrong, please try again later.",
      code: HttpStatusCode.INTERNAL_SERVER,
    });
    next(error);
    return;
  }

  await errorHandler.handleError(error);
  res.status(error.httpCode).json({
    error: error.message,
    code: error.httpCode,
  });
}

export default app;
