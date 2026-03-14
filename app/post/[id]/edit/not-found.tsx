import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
        Post Not Found
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        This post doesn&apos;t exist or has been deleted.
      </p>
      <Link
        href="/"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
