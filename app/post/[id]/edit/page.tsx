import clientPromise, { dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { updatePost } from "../../../actions";
import PostForm from "@/components/PostForm";
import { getCurrentUser } from "@/lib/auth";

interface Post {
  _id: ObjectId;
  title: string;
  author: string;
  authorId?: string;
  content: string;
}

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!ObjectId.isValid(id)) {
    return notFound();
  }

  let post: Post | null = null;

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    post = await db.collection<Post>("posts").findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error("Database connection error:", error);
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Connection Error
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Unable to connect to the database.
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

  if (!post) {
    return notFound();
  }

  if (post.authorId !== user.username) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          You can only edit your own posts.
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

  const handleSubmit = async (data: { title: string; content: string }) => {
    "use server";
    await updatePost(id, data);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
        Edit Post
      </h1>
      <PostForm
        defaultValues={{
          title: post.title,
          content: post.content,
        }}
        buttonText="Save Changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
