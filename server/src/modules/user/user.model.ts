import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

import { IUserDocument } from "./user.types";

const UserSchema = new Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
    },
  },
  { timestamps: true },
);

// encrypt password before save - Hook
UserSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// compare the password with passed on user password
UserSchema.methods.comparePassword = async function (
  userPassword: string,
): Promise<boolean> {
  const comparedPassword = await bcrypt.compare(userPassword, this.password);
  return comparedPassword;
};

const UserModel = model<IUserDocument>("User", UserSchema);
export default UserModel;
