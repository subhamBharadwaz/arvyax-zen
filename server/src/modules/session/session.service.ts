import { Types } from "mongoose";
import Session from "./session.model";
import { ISession } from "./session.types";

export const saveDraftSessionService = async (session: ISession) => {
  if (session._id && Types.ObjectId.isValid(session._id)) {
    // Update draft
    return Session.findOneAndUpdate(
      { _id: session._id, user_id: session.user_id },
      { ...session, status: "draft" },
      { new: true },
    );
  }

  // Create new draft
  return Session.create({
    ...session,
    status: "draft",
  });
};

export const publishSessionService = async (
  sessionId: string,
  userId: string,
) => {
  return Session.findOneAndUpdate(
    { _id: sessionId, user_id: userId },
    { status: "published" },
    { new: true },
  );
};

export const getPublicSessionsService = async (
  page: number = 1,
  limit: number = 12,
  cursor?: string,
) => {
  const query: any = { status: "published" };

  if (cursor) {
    query.created_at = { $lt: new Date(cursor) };
  }

  const sessions = await Session.find(query)
    .sort({ created_at: -1 })
    .limit(limit)
    .populate("user_id", "name email")
    .lean();

  const hasMore = sessions.length === limit;
  const nextCursor =
    sessions.length > 0 ? sessions[sessions.length - 1].created_at : null;

  return {
    sessions,
    hasMore,
    nextCursor,
    total: await Session.countDocuments({ status: "published" }),
  };
};

export const getUserSessionsService = async (
  userId: string,
  page: number = 1,
  limit: number = 12,
  cursor?: string,
) => {
  const query: any = { user_id: userId };

  if (cursor) {
    query.created_at = { $lt: new Date(cursor) };
  }

  const sessions = await Session.find(query)
    .sort({ created_at: -1 })
    .limit(limit)
    .lean();

  const hasMore = sessions.length === limit;
  const nextCursor =
    sessions.length > 0 ? sessions[sessions.length - 1].created_at : null;

  return {
    sessions,
    hasMore,
    nextCursor,
    total: await Session.countDocuments({ user_id: userId }),
  };
};

export const getSingleUserSessionService = (id: string, userId: string) => {
  return Session.findOne({ _id: id, user_id: userId });
};
