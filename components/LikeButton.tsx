"use client";

import { useState } from "react";
import { useNotificationStore } from "@/lib/store";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export default function LikeButton({ postId, initialLikes, initialLiked }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);
  const showNotification = useNotificationStore((state) => state.showNotification);

  const handleLike = async () => {
    setIsLoading(true);

    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;

    setLiked(newLiked);
    setLikes(newLikes);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: newLiked ? "POST" : "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to update like");
      }

      showNotification(newLiked ? "Post liked!" : "Post unliked", "success");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setLiked(!newLiked);
      setLikes(newLikes);
      showNotification("Failed to update like", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        liked
          ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      } disabled:opacity-50`}
    >
      <svg
        className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-medium">{likes}</span>
    </button>
  );
}
