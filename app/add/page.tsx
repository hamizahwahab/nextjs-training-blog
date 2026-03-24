import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createPost } from "../actions";
import PostForm from "@/components/PostForm";

export default async function AddPostPage() {

  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
        Add New Post
      </h1>
      <PostForm buttonText="Publish Post" onSubmit={createPost} />
    </div>
  );
}
