import Link from "next/link";

interface PostCardProps {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt?: Date;
}

export default function PostCard({
  id,
  title,
  author,
  content,
  createdAt,
}: PostCardProps) {
  return (
    <article className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="p-5">
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2 line-clamp-1">
          {title}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
          By {author}
          {createdAt && (
            <span className="ml-2">
              • {new Date(createdAt).toLocaleDateString('en-GB')}
            </span>
          )}
        </p>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4 line-clamp-3">
          {content}
        </p>
        <Link
          href={`/post/${id}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          Read Full Article
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
