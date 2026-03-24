"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import Comment from "./Comment";
import Alert from "@/components/ui/Alert";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt?: string;
}

export default function CommentList({ postId }: { postId: string }) {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  const { data: comments, error, isLoading } = useSWR<Comment[]>(
    `/api/posts/${postId}/comments`,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => setCurrentUser(data?.username || null))
      .catch(() => setCurrentUser(null));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
          <div className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className="mt-4">
        Failed to load comments. Please try again.
      </Alert>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <Alert variant="info" className="mt-4">
        No comments yet. Be the first to comment!
      </Alert>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
        {comments.length} Comment{comments.length !== 1 ? "s" : ""}
      </h3>
      {comments.map((comment) => (
        <Comment 
          key={comment._id.toString()} 
          comment={comment} 
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}
