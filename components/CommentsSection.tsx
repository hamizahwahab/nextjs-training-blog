"use client";

import { useState } from "react";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

export default function CommentsSection({ postId }: { postId: string }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <CommentForm postId={postId} onSuccess={handleSuccess} />
      <CommentList key={refreshKey} postId={postId} />
    </>
  );
}
