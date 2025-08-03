import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction, Request } from "express";
import User from "../modules/user/user.model";

export interface IGetUserAuthInfoRequest extends Request {
  user?: any;
}

const isLoggedIn = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization || req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    async (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Login first to access", err });

      const payload = decoded as JwtPayload;
      const userId = payload.id;

      if (!userId) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      req.user = await User.findById(userId);

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    },
  );
};

export default isLoggedIn;
