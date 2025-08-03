import { z } from "zod";

export const saveDraftSessionSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).optional(),
    json_file_url: z
      .string()
      .url("Must be a valid URL")
      .or(z.literal(""))
      .optional(),
  }),
});

export const puiblishSessionSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1, "Session ID is required"),
  }),
});
