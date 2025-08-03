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

// CORS configuration - more explicit for production
const origins = env.ORIGIN?.split(",").map((o) => o.trim()) ?? [];

// Add localhost for development if needed
if (env.NODE_ENV === "development") {
  origins.push("http://localhost:3000", "http://127.0.0.1:3000");
}

console.log("Allowed origins:", origins); // Debug log

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (origins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin); // Debug log
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

// Handle preflight requests
app.options("*", cors());

// regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies middleware
app.use(cookieParser());

// set security headers - modify helmet for CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

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
