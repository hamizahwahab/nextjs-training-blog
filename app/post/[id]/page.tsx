import clientPromise, { dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

interface Post {
  _id: ObjectId;
  title: string;
  author: string;
  content: string;
  createdAt?: Date;
}

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return notFound();
  }

  const client = await clientPromise;
  const db = client.db(dbName);

  const post = await db.collection<Post>("posts").findOne({
    _id: new ObjectId(id),
  });

  if (!post) {
    return notFound();
  }

  async function deletePost() {
    "use server";
    const client = await clientPromise;
    const db = client.db(dbName);
    await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
    redirect("/");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline mb-6"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to All Posts
      </Link>

      <div className="flex flex-col sm:flex-row gap-3 border-t border-neutral-200 dark:border-neutral-800 pt-5 mb-6">
        <Link
          href={`/post/${id}/edit`}
          className="inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Post
        </Link>

        <DeleteButton onDelete={deletePost} />
      </div>

      <article className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8">
        <header className="border-b-2 border-neutral-100 dark:border-neutral-800 pb-5 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            {post.title}
          </h1>
          <div className="text-neutral-500 dark:text-neutral-400 text-sm">
            <span>
              Published by <strong className="text-neutral-700 dark:text-neutral-300">{post.author}</strong>
            </span>
            {post.createdAt && (
              <span className="ml-2">
                • {new Date(post.createdAt).toLocaleDateString('en-GB')}
              </span>
            )}
          </div>
        </header>

        <section className="prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
          {post.content}
        </section>
      </article>
    </div>
  );
}
