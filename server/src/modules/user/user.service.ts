import { IUser, IUserDocument } from "./user.types";
import User from "./user.model";
import { BaseError } from "../../utils";

export async function registerUserService(
  input: IUser,
): Promise<IUserDocument> {
  try {
    return User.create(input);
  } catch (error: unknown) {
    throw new BaseError(
      "Could not perform register user operation,",
      error,
      "registerUserService",
    );
  }
}

export async function findUserService(email: string) {
  try {
    return User.findOne({ email }).select("+password");
  } catch (error: unknown) {
    throw new BaseError(
      "Could not perform find user operation",
      error,
      "findUserService",
    );
  }
}

export async function findUserByIdService(id: string, select?: string) {
  try {
    return User.findById(id).select(select as string);
  } catch (error: unknown) {
    throw new BaseError(
      "Could not perform find user by id operation",
      error,
      "findUserByIdService",
    );
  }
}
