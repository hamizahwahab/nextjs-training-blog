import clientPromise, { dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound, redirect } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) return notFound();

  const client = await clientPromise;
  const db = client.db(dbName);
  const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });

  if (!post) return notFound();

  async function updatePost(formData: FormData) {
    "use server";
    const client = await clientPromise;
    const db = client.db(dbName);

    await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: formData.get("title"),
          author: formData.get("author"),
          content: formData.get("content"),
        },
      }
    );
    redirect(`/post/${id}`);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
        Edit Post
      </h1>
      <form action={updatePost} className="space-y-4">
        <div>
          <input
            name="title"
            defaultValue={post.title as string}
            placeholder="Title"
            required
            className="w-full px-4 py-3 text-base border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        <div>
          <input
            name="author"
            defaultValue={post.author as string}
            placeholder="Author"
            required
            className="w-full px-4 py-3 text-base border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        <div>
          <textarea
            name="content"
            defaultValue={post.content as string}
            placeholder="Content"
            required
            rows={6}
            className="w-full px-4 py-3 text-base border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
