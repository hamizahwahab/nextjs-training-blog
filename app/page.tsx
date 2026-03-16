import clientPromise, { dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";

interface Post {
  _id: ObjectId;
  title: string;
  author: string;
  content: string;
  createdAt?: Date;
}

interface HomePageProps {
  searchParams: Promise<{ search?: string }>;
}

export const revalidate = 0;

export default async function HomePage({ searchParams }: HomePageProps) {
  const { search } = await searchParams;
  
  const client = await clientPromise;
  const db = client.db(dbName);

  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const posts = await db
    .collection<Post>("posts")
    .find(query)
    .sort({ _id: -1 })
    .toArray();

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

      <SearchBar />

      {search && (
        <div className="text-center mb-6">
          <p className="text-neutral-600 dark:text-neutral-400">
            {posts.length === 0
              ? `No results found for "${search}"`
              : `Found ${posts.length} result${posts.length === 1 ? "" : "s"} for "${search}"`}
          </p>
        </div>
      )}

      {posts.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id.toString()}
              id={post._id.toString()}
              title={post.title}
              author={post.author}
              content={post.content}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
