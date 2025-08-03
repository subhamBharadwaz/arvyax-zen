import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { BaseError, ErrorHandler } from "./utils";
import { HttpStatusCode } from "./types/http.model";

// import routes
import user from "./modules/user/user.route";
import session from "./modules/session/session.route";
import { logger } from "./middlewares";
import env from "./env";

const app = express();

const errorHandler = new ErrorHandler(logger);

// cors
app.use(
  cors({
    origin: env.ORIGIN,
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

// router middleware
app.use("/api/v1", user);
app.use("/api/v1", session);

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
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
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
