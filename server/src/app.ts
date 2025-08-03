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

const app = express();
const errorHandler = new ErrorHandler(logger);

// Get origin from environment variable - same pattern as working app
const origin = process.env.ORIGIN || "http://localhost:3000";

console.log("🚀 Starting server...");
console.log("Environment:", process.env.NODE_ENV);
console.log("Port:", process.env.PORT);
console.log("Origin:", origin);

// cors - using the same pattern as your working app
app.use(
  cors({
    origin: origin,
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

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    origin: origin,
    env: process.env.NODE_ENV,
  });
});

// router middleware
app.use("/api/v1", user);
app.use("/api/v1", session);

// Handling errors - using the same pattern as your working app
app.use(errorMiddleware);

process.on("uncaughtException", async (error: Error) => {
  await errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) process.exit(1);
});

process.on("unhandledRejection", (reason: Error) => {
  throw reason;
});

// Error middleware - same pattern as your working app
async function errorMiddleware(
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!errorHandler.isTrustedError(err)) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      error: "Something went wrong, please try again later.",
      code: HttpStatusCode.INTERNAL_SERVER,
    });
    next(err);
    return;
  }
  await errorHandler.handleError(err);
  res.status(err.httpCode).json({
    error: err.message,
    code: err.httpCode,
  });
}

export default app;
