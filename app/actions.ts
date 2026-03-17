"use server";

import clientPromise, { dbName } from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { PostFormData } from "@/lib/schemas";

export async function createPost(data: PostFormData) {
  const client = await clientPromise;
  const db = client.db(dbName);

  await db.collection("posts").insertOne({
    title: data.title,
    author: data.author,
    content: data.content,
    createdAt: new Date(),
  });

  redirect("/");
}

export async function updatePost(id: string, data: PostFormData) {
  const client = await clientPromise;
  const db = client.db(dbName);

  await db.collection("posts").updateOne(
    { _id: new (await import("mongodb")).ObjectId(id) },
    {
      $set: {
        title: data.title,
        author: data.author,
        content: data.content,
      },
    }
  );

  redirect(`/post/${id}`);
}
