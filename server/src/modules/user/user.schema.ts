import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, { message: "First Name is required" }),

    lastName: z.string().min(1, { message: "Last Name is required" }),

    email: z.email({
      pattern: z.regexes.html5Email,
      error: (issue) =>
        issue.input === undefined ? "Email is required" : "Not a string",
    }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  }),
});

export type CreateRegisterUserInput = z.TypeOf<
  typeof registerUserSchema
>["body"];

export const loginUserSchema = z.object({
  body: z.object({
    email: z.email({
      pattern: z.regexes.html5Email,
      error: (issue) =>
        issue.input === undefined ? "Email is required" : "Not a string",
    }),

    password: z.string().min(1, "Password is required"),
  }),
});

export type CreateLoginUserInput = z.TypeOf<typeof loginUserSchema>["body"];
