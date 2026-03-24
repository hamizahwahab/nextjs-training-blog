import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500),
});

// NEW: User registration schema
export const userRegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const userLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type UserRegisterData = z.infer<typeof userRegisterSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;

export type PostFormData = z.infer<typeof postSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;