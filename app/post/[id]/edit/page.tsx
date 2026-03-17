import clientPromise, { dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import { updatePost } from "../../../actions";
import PostForm from "@/components/PostForm";

interface Post {
  _id: ObjectId;
  title: string;
  author: string;
  content: string;
}

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Invalid Post ID
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          The post ID format is invalid.
        </p>
      </div>
    );
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
          Unable to connect to the database. Please check your MongoDB connection.
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Post Not Found
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          This post doesn&apos;t exist or has been deleted.
        </p>
      </div>
    );
  }

  const handleSubmit = async (data: { title: string; author: string; content: string }) => {
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
          author: post.author,
          content: post.content,
        }}
        buttonText="Save Changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
