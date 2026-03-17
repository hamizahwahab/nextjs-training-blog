"use client";

import useSWR from "swr";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PostCard from "./PostCard";

interface Post {
  _id: string;
  title: string;
  author: string;
  content: string;
  createdAt?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
});

function PostListContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  
  const apiUrl = search ? `/api/posts?search=${encodeURIComponent(search)}` : "/api/posts";

  const { data: posts, error, isLoading, mutate } = useSWR<Post[]>(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  if (error) {
    return (
      <div className="text-center py-12 sm:py-16 border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-xl">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
          Error Loading Posts
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Unable to load posts. Please try again.
        </p>
        <button
          onClick={() => mutate()}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden p-5 animate-pulse"
          >
            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3" />
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-4" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
        <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-lg">
          {search
            ? `No posts found matching "${search}".`
            : "No posts found. Be the first to write something!"}
        </p>
        <Link
          href="/add"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Create a Post
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          id={post._id}
          title={post.title}
          author={post.author}
          content={post.content}
          createdAt={post.createdAt ? new Date(post.createdAt) : undefined}
        />
      ))}
    </div>
  );
}

export default function PostList() {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden p-5 animate-pulse"
            >
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-4" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      }
    >
      <PostListContent />
    </Suspense>
  );
}
