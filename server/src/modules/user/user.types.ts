import { Document } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword: (userPassword: string) => Promise<boolean>;
}
