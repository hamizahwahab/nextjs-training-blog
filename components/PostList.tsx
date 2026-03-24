"use client";

import useSWR from "swr";
import Link from "next/link";
import { ObjectId } from "mongodb";
import Alert from "@/components/ui/Alert";
import { Skeleton } from "./Skeleton";

interface Post {
  _id: ObjectId;
  title: string;
  author: string;
  content: string;
  createdAt?: Date;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PostList() {
  const apiUrl = "/api/posts";
  const { data: posts, error, isLoading } = useSWR<Post[]>(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    refreshInterval: 30000,
    fallbackData: undefined,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        Failed to load posts. Please try again later.
      </Alert>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Alert variant="info">
        No posts yet. Be the first to create one!
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.map((post) => (
        <Link
          key={post._id.toString()}
          href={`/post/${post._id.toString()}`}
          className="block group"
        >
          <article className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:shadow-lg transition-shadow h-full">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-3">
              By {post.author}
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 line-clamp-3">
              {post.content}
            </p>
          </article>
        </Link>
      ))}
    </div>
  );
}
