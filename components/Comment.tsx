"use client";

import { useState } from "react";
import { useNotificationStore } from "@/lib/store";
import Button from "@/components/ui/Button";

interface CommentProps {
  comment: {
    _id: string;
    author: string;
    content: string;
    createdAt?: string;
  };
  currentUser?: string | null;
}

export default function Comment({ comment, currentUser }: CommentProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showNotification } = useNotificationStore();

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/comments/${comment._id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        showNotification("Comment deleted", "success");
        window.location.reload();
      } else {
        showNotification("Failed to delete comment", "error");
      }
    } catch (error) {
      console.log('Error to delete comment', error);
      showNotification("Failed to delete comment", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-neutral-900 dark:text-white">
          {comment.author}
        </span>
        <div className="flex items-center gap-2">
          {comment.createdAt && (
            <span className="text-neutral-500 dark:text-neutral-400 text-sm">
              {new Date(comment.createdAt).toLocaleDateString("en-GB")}
            </span>
          )}
          {currentUser === comment.author && (
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              isLoading={isDeleting}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      <p className="text-neutral-600 dark:text-neutral-300">{comment.content}</p>
    </div>
  );
}
