"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, CommentFormData } from "@/lib/schemas";
import { useSWRConfig } from "swr";
import { useNotificationStore } from "@/lib/store";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Alert from "@/components/ui/Alert";

interface CommentFormProps {
  postId: string;
  onSuccess?: () => void;
}

export default function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const { mutate } = useSWRConfig();
  const { showNotification } = useNotificationStore();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.username);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    checkAuth();
  }, []);

  const onSubmit = async (data: CommentFormData) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data.content }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to add comment");
      }
      
      reset();
      mutate(`/api/posts/${postId}/comments`);
      showNotification("Comment added successfully!", "success");
      onSuccess?.();
    } catch (error) {
      console.log('Error adding comment:', error);
      showNotification("Failed to add comment", "error");
    }
  };

  if (isLoadingUser) {
    return null;
  }

  if (!currentUser) {
    return (
      <Alert variant="info">
        Please <a href="/login" className="underline font-medium">login</a> to leave a comment.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-sm text-neutral-600 dark:text-neutral-400">
        Commenting as <span className="font-medium text-neutral-900 dark:text-white">{currentUser}</span>
      </div>

      <Textarea
        {...register("content")}
        placeholder="Write a comment..."
        rows={3}
        error={errors.content?.message}
      />

      <Button type="submit" isLoading={isSubmitting}>
        Add Comment
      </Button>
    </form>
  );
}
