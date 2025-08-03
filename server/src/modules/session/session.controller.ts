import { asyncHandler } from "../../middlewares";
import {
  getPublicSessionsService,
  getSingleUserSessionService,
  getUserSessionsService,
  publishSessionService,
  saveDraftSessionService,
} from "./session.service";
import { IGetUserAuthInfoRequest } from "../../middlewares/is-logged-in.middleware";
import { NextFunction, Request, Response } from "express";
import { APIError } from "../../utils";

export const getPublicSessionsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const cursor = req.query.cursor as string;

    const sessions = await getPublicSessionsService(page, limit, cursor);
    res.status(200).json({ success: true, ...sessions });
  },
);

export const getUserSessionsHandler = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const cursor = req.query.cursor as string;

    const sessions = await getUserSessionsService(userId, page, limit, cursor);
    res.status(200).json({ success: true, ...sessions });
  },
);

export const getSingleUserSessionHandler = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const session = await getSingleUserSessionService(
      req.params.id,
      req.user._id,
    );
    if (!session)
      return next(
        new APIError("Session not found", "getSingleUserSession", 404),
      );
    res.status(200).json({ success: true, session });
  },
);

export const saveDraftSessionHandler = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const session = await saveDraftSessionService({
      ...req.body,
      user_id: req.user._id,
    });
    res.status(200).json({ success: true, session });
  },
);

export const publishSessionHandler = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const session = await publishSessionService(
      req.body.sessionId,
      req.user._id,
    );
    res.status(200).json({ success: true, session });
  },
);
