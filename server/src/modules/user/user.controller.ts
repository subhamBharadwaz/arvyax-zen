import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares";
import { IUser } from "./user.types";
import { APIError, signAccessToken, signRefreshToken } from "../../utils";
import {
  findUserByIdService,
  findUserService,
  registerUserService,
} from "./user.service";
import { HttpStatusCode } from "../../types/http.model";
import { CreateLoginUserInput } from "./user.schema";
import { IGetUserAuthInfoRequest } from "../../middlewares/is-logged-in.middleware";
import env from "../../env";

/** 
@desc    Register User
@route   POST /api/v1/register
@access  Public
*/
export const registerHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password }: IUser = req.body;

    // check for presence of the required fields
    if (!(firstName && lastName && email && password)) {
      const message = "First Name, Last Name, Email, Password are required";
      return next(new APIError(message, "registerHandler"));
    }

    // if the user already signed up with the same email
    const existingUser = await findUserSerice(email);
    if (existingUser) {
      const message = "User already exists";
      return next(
        new APIError(message, "registerHandler", HttpStatusCode.ALREADY_EXISTS),
      );
    }

    // create user

    const user = await registerUserService({
      firstName,
      lastName,
      email,
      password,
    });

    const accessToken = signAccessToken({ id: user._id });
    const refreshToken = signRefreshToken({ id: user._id });

    res.cookie("token", refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      // @ts-ignore
      sameSite: env.NODE_ENV === "production" ? "None" : "Lax",
    });

    const { password: _p, ...userWithoutPassword } = user.toJSON?.() || user;

    res.status(201).json({
      success: true,
      accessToken,
      user: userWithoutPassword,
    });
  },
);

/** 
@desc    Login User
@route   POST /api/v1/login
@access  Public
*/
export const loginHandler = asyncHandler(
  async (
    req: Request<{}, {}, CreateLoginUserInput>,
    res: Response,
    next: NextFunction,
  ) => {
    const { email, password } = req.body;

    // check for presence of email and password
    if (!(email && password)) {
      const message = "Email and password are required";
      return next(
        new APIError(message, "loginHandler", HttpStatusCode.BAD_REQUEST),
      );
    }

    const user = await findUserService(email);

    if (!user) {
      const message = "Email or password do not match or exist";
      return next(
        new APIError(message, "loginHandler", HttpStatusCode.BAD_REQUEST),
      );
    }

    // match the password
    const isPasswordCorrect = await user.comparePassword(password);

    // if password do not match
    if (!isPasswordCorrect) {
      const message = "Email or password do not match or exist";
      return next(
        new APIError(message, "loginHandler", HttpStatusCode.BAD_REQUEST),
      );
    }

    const accessToken = signAccessToken({ id: user._id });
    const refreshToken = signRefreshToken({ id: user._id });

    res.cookie("token", refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      // @ts-ignore
      sameSite: env.NODE_ENV === "production" ? "None" : "Lax",
    });

    const { password: _p, ...userWithoutPassword } = user.toJSON?.() || user;

    res.status(201).json({
      success: true,
      accessToken,
      user: userWithoutPassword,
    });
  },
);

/** 
@desc    Logout User
@route   POST /api/v1/logout
@access  Private
*/
export const logoutHandler = (req: Request, res: Response) => {
  const { cookies } = req;
  if (!cookies?.token) return res.sendStatus(204);

  res.clearCookie("token", {
    httpOnly: true,
    //@ts-ignore
    sameSite: env.NODE_ENV === "production" ? "None" : "Lax",
    secure: env.NODE_ENV === "production",
  });
  res.status(200).json({
    success: true,
    message: "Logout Success",
  });
};

/** 
@desc    Get Logged-in User Details
@route   GET /api/v1/me
@access  Private
*/
export const getUserHandler = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = await findUserByIdService(req.user.id, "-password");

    res.status(200).json({ success: true, user });
  },
);
