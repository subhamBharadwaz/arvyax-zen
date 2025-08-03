import { Router } from "express";

import { loginUserSchema, registerUserSchema } from "./user.schema";
import {
  getUserHandler,
  loginHandler,
  logoutHandler,
  registerHandler,
} from "./user.controller";
import { validateResource } from "../../middlewares";
import { isLoggedIn } from "../../middlewares";

const router = Router();

router
  .route("/register")
  .post(validateResource(registerUserSchema), registerHandler);

router.route("/login").post(validateResource(loginUserSchema), loginHandler);

router.route("/logout").post(logoutHandler);

router.route("/me").get(isLoggedIn, getUserHandler);

export default router;
