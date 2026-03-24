"use client";

import useSWR, { mutate } from "swr";
import Comment from "./Comment";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string | Date;
}

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const { data: comments, error, isLoading } = useSWR<Comment[]>(
    `/api/posts/${postId}/comments`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCommentAdded = () => {
    mutate(`/api/posts/${postId}/comments`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-1/4 mb-2" />
            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">Failed to load comments</p>
        <button
          onClick={() => mutate(`/api/posts/${postId}/comments`)}
          className="text-blue-600 dark:text-blue-400 hover:underline mt-2"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
        {comments?.length || 0} Comments
      </h3>
      {comments?.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No comments yet. Be the first to comment!</p>
      ) : (
        comments?.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onDelete={() => {
              mutate(`/api/posts/${postId}/comments`);
            }}
          />
        ))
      )}
    </div>
  );
}
