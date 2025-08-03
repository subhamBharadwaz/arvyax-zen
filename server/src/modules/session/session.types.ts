import { Document, Types } from "mongoose";

export interface ISession {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  title: string;
  tags: string[];
  json_file_url: string;
  status?: "draft" | "published";
}

//@ts-ignore
export interface ISessionDocument extends Document<Types.ObjectId>, ISession {
  created_at: Date;
  updated_at: Date;
}
