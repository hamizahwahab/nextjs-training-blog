"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, CommentFormData } from "@/lib/schemas";
import { useNotificationStore } from "@/lib/store";

interface CommentFormProps {
  postId: string;
  onSuccess: () => void;
}

export default function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showNotification = useNotificationStore((state) => state.showNotification);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to add comment");
      }

      reset();
      showNotification("Comment added successfully!", "success");
      onSuccess();

    } catch (error) {
      console.log('Error to add comment', error);
      showNotification("Failed to add comment", "error");

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("author")} placeholder="Your name" className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      {errors.author && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.author.message}</p>}
      
      <textarea {...register("content")} placeholder="Write a comment..." className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} />
      {errors.content && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.content.message}</p>}
      
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-3 rounded-lg transition-colors">
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
