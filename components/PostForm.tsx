"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormData } from "@/lib/schemas";

interface PostFormProps {
  defaultValues?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  buttonText: string;
  isSubmitting?: boolean;
}

export default function PostForm({
  defaultValues,
  onSubmit,
  buttonText,
  isSubmitting = false,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register("title")}
          placeholder="Post Title"
          className={`w-full px-4 py-3 text-base border rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.title
              ? "border-red-500 dark:border-red-500"
              : "border-neutral-300 dark:border-neutral-600"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <textarea
          {...register("content")}
          placeholder="Write your content here..."
          rows={6}
          className={`w-full px-4 py-3 text-base border rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y ${
            errors.content
              ? "border-red-500 dark:border-red-500"
              : "border-neutral-300 dark:border-neutral-600"
          }`}
        />
        {errors.content && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.content.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        {isSubmitting ? "Saving..." : buttonText}
      </button>
    </form>
  );
}
