import { Router } from "express";
import { isLoggedIn, validateResource } from "../../middlewares";
import {
  puiblishSessionSchema,
  saveDraftSessionSchema,
} from "./session.schema";
import {
  getPublicSessionsHandler,
  getSingleUserSessionHandler,
  getUserSessionsHandler,
  publishSessionHandler,
  saveDraftSessionHandler,
} from "./session.controller";

const router = Router();

router.route("/sessions").get(isLoggedIn, getPublicSessionsHandler);

router.route("/my-sessions").get(isLoggedIn, getUserSessionsHandler);

router.route("/my-sessions/:id").get(isLoggedIn, getSingleUserSessionHandler);

router
  .route("/my-sessions/save-draft")
  .post(
    isLoggedIn,
    validateResource(saveDraftSessionSchema),
    saveDraftSessionHandler,
  );

router
  .route("/my-sessions/publish")
  .post(
    isLoggedIn,
    validateResource(puiblishSessionSchema),
    publishSessionHandler,
  );

export default router;
