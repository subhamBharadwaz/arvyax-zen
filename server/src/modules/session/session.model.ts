import { model, Schema } from "mongoose";
import { ISessionDocument } from "./session.types";

const sessionSchema = new Schema<ISessionDocument>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    json_file_url: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

const SessionModel = model<ISessionDocument>("Session", sessionSchema);
export default SessionModel;
