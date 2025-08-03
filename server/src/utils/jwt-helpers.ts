import jwt from "jsonwebtoken";
import env from "../env";

type AccessTokenPayload = {
  id: string;
};

type RefreshTokenPayload = {
  id: string;
};

export const signAccessToken = (payload: AccessTokenPayload) => {
  const accessTokenSecret = env.ACCESS_TOKEN_SECRET;
  const accessTokenExpiry = env.ACCESS_TOKEN_EXPIRY || "60m";

  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || "7d";

  if (!refreshTokenSecret) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }

  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
};
