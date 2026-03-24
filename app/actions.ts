"use server";

import clientPromise, { dbName } from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { PostFormData } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/auth";

export async function createPost(data: PostFormData) {

  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db(dbName);

  await db.collection("posts").insertOne({
    title: data.title,
    author: user.username,
    authorId: user.username,
    content: data.content,
    createdAt: new Date(),
  });

  redirect("/");
}

export async function updatePost(id: string, data: PostFormData) {

  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db(dbName);

   // Get the post first to check ownership
  const post = await db.collection("posts").findOne({ 
    _id: new (await import("mongodb")).ObjectId(id) 
  });
  
  if (!post) {
    redirect("/");
  }

  // Check ownership
  if (post.authorId !== user.username) {
    throw new Error("You can only edit your own posts");
  }

  await db.collection("posts").updateOne(
    { _id: new (await import("mongodb")).ObjectId(id) },
    {
      $set: {
        title: data.title,
        content: data.content,
      },
    }
  );

  redirect(`/post/${id}`);
}
