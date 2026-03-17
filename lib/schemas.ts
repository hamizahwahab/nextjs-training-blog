import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  author: z
    .string()
    .min(2, "Author must be at least 2 characters")
    .max(50, "Author must be less than 50 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
});

export type PostFormData = z.infer<typeof postSchema>;
