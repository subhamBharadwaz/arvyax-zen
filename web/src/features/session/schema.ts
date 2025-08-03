import { z } from "zod";

export const draftSessionSchema = z.object({
  title: z.string(),
  tags: z.string(),
  json_file_url: z.string(),
});

export const publishSessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tags: z.string(),
  json_file_url: z.string().url("Please enter a valid URL"),
});

export const sessionSchema = publishSessionSchema;

export type SessionFormData = z.infer<typeof sessionSchema>;
