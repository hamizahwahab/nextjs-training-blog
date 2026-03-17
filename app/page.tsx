import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import PostList from "@/components/PostList";

function SearchBarFallback() {
  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <div className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse h-12" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white mb-3">
          Recent Stories
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg">
          Insights and thoughts from the{" "}
          <code className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-sm">
            blog_db
          </code>{" "}
          database.
        </p>
      </header>

      <Suspense fallback={<SearchBarFallback />}>
        <SearchBar />
      </Suspense>

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
        <PostList />
      </Suspense>
    </div>
  );
}
